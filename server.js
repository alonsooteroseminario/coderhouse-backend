const express = require("express");
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const { normalize, schema } = require('normalizr');
const productRoutes = require("./src/routes/products");
const ArchivoDB = require('./src/DB/archivoDb');
const archivoDB = new ArchivoDB();
const compression = require('compression');
const { logger, loggerWarn, loggerError } = require('./src/utils/logger')
const { transporter, transporterGmail } = require('./src/controllers/email');
const { passport } = require('./src/controllers/passport');

const port = process.env.PORT || parseInt(process.argv[2]) || 8080;

/* --------------------- AUTH --------------------------- */

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* --------------------- SERVER --------------------------- */

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const url = `mongodb+srv://${admin.toString()}:${password.toString()}@cluster0.rzdyo.mongodb.net/sesiones?retryWrites=true&w=majority`;

/* --------------------- MIDDLEWARE --------------------------- */
var hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: 'main.hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({ 
    mongoUrl: url,
    ttl: 10 * 60, // = 10 min. Default
    mongoOptions: advancedOptions }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/faillogin' }));

/* -------- ROUTES ------------ */
app.use("/productos", isAuth, productRoutes);

/* --------- INICIO ---------- */
app.get('/', isAuth, (req, res) => {
  const user = req.user;

  let nombre_usuario = user.username;
  let nombre_email = user.email;
  let foto_facebook = user.foto;

  const mailOptionsGmail = {
    from: 'Servidor Node.js',
    to: nombre_email,
    subject: `Mail Gmail de ${nombre_usuario} a las ${new Date().toLocaleString()}`,
    html: `<h1 style="color: blue;">El usuario ${nombre_usuario} se a logueado con Facebook a las ${new Date().toLocaleString()} </h1>`,
    attachments: [
      {   // filename and content type is derived from path
          path: foto_facebook
      }
  ]
  };
  const mailOptionsLogin = {
    from: 'Servidor Login',
    to: 'kadin.bernier77@ethereal.email',
    subject: `Mail de Login de ${nombre_usuario} a las ${new Date().toLocaleString()}`,
    html: `<h1 style="color: blue;">El usuario ${nombre_usuario} se a logueado con Facebook a las ${new Date().toLocaleString()} </h1>`
  };

  transporter.sendMail(mailOptionsLogin, (err, info) => {
      if(err) {
          console.log(err)
          return err
      }
      // console.log(info)
  })
  transporterGmail.sendMail(mailOptionsGmail, (err, info) => {
      if(err) {
          console.log(err)
          return err
      }
      // console.log(info)
  })

  res.redirect('/productos/vista')
})
app.get('/chat', isAuth, (req, res) => {
  if (!req.user.contador){
    req.user.contador = 0
  }
  // res.status(200)
  res.sendFile('./src/index.html', { root:__dirname })
});
/* --------- INFO ---------- */
app.get('/info', compression(), (req, res) => {
  try {
    console.log('Console log INFO')
    logger.info('Mensaje info -----------------> OK');
    loggerWarn.warn('Mensaje warn -----------------> OK')
    const numCPUs = require('os').cpus().length
    res.render('info', {
      user: req.user,
      info: process,
      argv: process.argv,
      memoryUsage: process.memoryUsage(),
      numCPUs: numCPUs,
    });
  } catch(err) {
    loggerWarn.warn('Error message: ' + err)
    logger.info('Error message: ' + err);
    loggerError.error('Error message: ' + err);
  }
});
/* --------- LOGOUT ---------- */
app.get('/logout', (req, res) => {


  setTimeout(function(){ 
    res.redirect('http://localhost:8080/login');
  }, 2000);
  const user = req.user;
  console.log(user)
  let nombre_usuario = user.username;
  const mailOptionsLogout = {
    from: 'Servidor Logout',
    to: 'kadin.bernier77@ethereal.email',
    subject: `Mail de Logout de ${nombre_usuario} a las ${new Date().toLocaleString()}`,
    html: `<h1 style="color: blue;">El usuario ${nombre_usuario} se a deslogueado a las ${new Date().toLocaleString()} </h1>`
  };
  transporter.sendMail(mailOptionsLogout , (err, info) => {
    if(err) {
        console.log(err)
        return err
    }
    console.log(info)
  });
  req.logout();
})
/* --------- LOGIN ---------- */
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/faillogin', (req, res) => {
  res.render('login-error', {});
})

const user = new schema.Entity("users");
const text = new schema.Entity("text");
const mensaje = new schema.Entity("mensaje", {
  author: user,
  text: text,
});
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});

const accountSid = process.env.ACCOUNT_SID_TWILIO.toString();
const authToken = process.env.AUTHTOKEN_TWILIO.toString();

const client = require('twilio')(accountSid, authToken);

io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  //lista desde base de datos y desnomalizr
  let listaMensajes = await archivoDB.listar();

  socket.emit('messages', listaMensajes)

  socket.on('new-message', async (data) => {
    const nuevoMensaje = {
      id: listaMensajes.length+1,
      author: {
        id: data.author.id,
        nombre: data.author.nombre,
        apellido: data.author.apellido,
        edad: data.author.edad,
        alias: data.author.alias,
        avatar: data.author.avatar
      },
      text: {
        id: listaMensajes.length+1,
        text: data.text,
      },
      date: new Date().toLocaleString()
    };
    if (data.text.toString().includes("administrador")){
        client.messages.create({
          body: `Mensaje enviado por ${data.author.nombre} ${data.author.apellido}. \n\n
                Texto completo: \n\n
                ${data.text}`,
          from: '+17637103691',
          to: '+56956942823'
        })
        .then(message => console.log(message.sid))
        .catch(console.log)
    }
    listaMensajes.push(nuevoMensaje)
    const originalData = {
      id: "1",
      mensajes: listaMensajes,
    };
    const normalizedData = normalize(originalData, mensajes);
    await archivoDB.insertar(normalizedData);
    io.sockets.emit('messages', listaMensajes)
  })
})

process.on('exit', function (code) {
  console.log('Exit code:'+ code);
});

const server = httpServer.listen(port, () => {
  logger.info('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => {
  logger.info('Error message: ' + err); 
  loggerError.error('Error message: ' + err);
});

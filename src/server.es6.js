const express = require("express");
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const { normalize, schema } = require('normalizr');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
// const loginRoutes = require('./routes/login');
const ArchivoDB = require('./DB/archivoDb');
const archivoDB = new ArchivoDB();
const UsuarioDB = require('./DB/usuariosDb');
const usuarioDB = new UsuarioDB();
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bCrypt = require('bcrypt');

/* ------------- VALIDATE PASSWORD ---------------- */

const isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.hashPassword);
}
let createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/* ------------------ PASSPORT -------------------- */
passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {

  const { direccion } = req.body

  let usuarios = await usuarioDB.listar();

  const usuario = usuarios.find(usuario => usuario.username == username)

  if (usuario) {
    return done('already registered')
  }

  const hashPassword = createHash(password);

  const user = {
    username,
    hashPassword,
    direccion,
  }
  usuarios.push(user)
  await usuarioDB.insertar(usuarios);

  return done(null, user)
}));
passport.use('login', new LocalStrategy(async (username, password, done) => {

  let usuarios = await usuarioDB.listar();

  const user = usuarios.find(usuario => usuario.username == username)

  if (!user) {
    return done(null, false)
  }

  if (!isValidPassword(user, password)) {
    return done(null, false)
  }

  user.contador = 0

  return done(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
  let usuarios = await usuarioDB.listar();
  const usuario = usuarios.find(usuario => usuario.username == username)
  done(null, usuario);
});

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

const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/sesiones?retryWrites=true&w=majority';

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
/* --------------------- ROUTES --------------------------- */

app.use("/productos", isAuth, productRoutes);
app.use("/productos/nuevo-producto", isAuth, frontRoutes);
// app.use("/", loginRoutes);

/* --------- LOGOUT ---------- */
app.get('/logout', (req, res) => {
  req.logout();
  setTimeout(function(){ 
    res.redirect('http://localhost:8080/login');
  }, 2000);
})
// LOGIN
app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/productos/vista' }))
app.get('/faillogin', (req, res) => {
  res.render('login-error', {});
})
// REGISTER
app.get('/register', (req, res) => {
  res.render('register')
})
app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' }))
app.get('/failregister', (req, res) => {
  res.render('register-error', {});
})
/* --------- INICIO ---------- */
app.get('/', isAuth, (req, res) => {
  res.redirect('/productos/vista')
})
app.get('/chat', isAuth, (req, res) => {
  if (!req.user.contador){
    req.user.contador = 0
  }
  res.sendFile('./index.html', { root:__dirname })
  
});

const user = new schema.Entity("users");
const text = new schema.Entity("text");
const mensaje = new schema.Entity("mensaje", {
  author: user,
  text: text,
});
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});

io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  //lista desde base de datos y desnomalizr
  let listaMensajes = await archivoDB.listar();

  socket.emit('messages', listaMensajes)

  socket.on('new-message', async (data) => {
    // console.log("/* -------------- DATA ------------- */");
    // console.log(data);
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
    // console.log(nuevoMensaje);
    listaMensajes.push(nuevoMensaje)
    // console.log(listaMensajes);
    const originalData = {
      id: "1",
      mensajes: listaMensajes,
    };
    const normalizedData = normalize(originalData, mensajes);
    // console.log("/* -------------- NORMALIZED ------------- */");
    // console.log(normalizedData)
    // console.log("/* -------------- NORMALIZED inspect utils------------- */");
    // console.log(utils.inspect(normalizedData, false, 4, true));
    await archivoDB.insertar(normalizedData);
    io.sockets.emit('messages', listaMensajes)
  })
})

const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

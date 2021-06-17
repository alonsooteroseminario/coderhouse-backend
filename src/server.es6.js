const express = require("express");
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { denormalize, normalize, schema } = require('normalizr');
const utils = require('util');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const loginRoutes = require('./routes/login');
const ArchivoDB = require('./DB/archivoDb');
const archivoDB = new ArchivoDB();

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

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
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use("/productos", productRoutes);
app.use("/productos/nuevo-producto", frontRoutes);
app.use("/", loginRoutes);

app.get('/chat', (req, res) => {
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

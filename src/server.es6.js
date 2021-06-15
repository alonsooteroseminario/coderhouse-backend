const express = require("express");
const exphbs = require('express-handlebars');
const { denormalize, normalize, schema } = require('normalizr');
const utils = require('util');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const ArchivoDB = require('./DB/archivoDb');
const archivoDB = new ArchivoDB();

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

var hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: 'main.hbs',
  helpers: {
    lowercase: function (s) { return s.toLowerCase(); },
    full_name: (firstname, lastname) => firstname + " " + lastname,
    ifeq: function(a,b,options) {
      if (a==b) { return options.fn(this);}
      return options.inverse(this);
    },
    ifnoteq: function(a,b,options) {
      if (a!=b) { return options.fn(this);}
      return options.inverse(this);
    },
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use("/productos", productRoutes);
app.use("/productos/nuevo-producto", frontRoutes);

app.get('/chat', (req, res) => {
  res.sendFile('./index.html', { root:__dirname })
});

const user = new schema.Entity("users");

// Define your text schema
const text = new schema.Entity("text");

// Define your mensaje
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
    // console.log(data);
    const nuevoMensaje = {
      id: listaMensajes.length+1,
      author: {
        id: data.author.idAttribute,
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
    console.log(listaMensajes);
    const originalData = {
      id: "1",
      mensajes: listaMensajes,
    };
    console.log("/* -------------- NORMALIZED ------------- */");
    const normalizedData = normalize(originalData, mensajes);
    console.log(normalizedData)
    await archivoDB.insertar(normalizedData);
    io.sockets.emit('messages', listaMensajes)
  })
})

const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

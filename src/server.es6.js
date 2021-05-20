// import express from 'express';
// import exphbs from 'express-handlebars';
// import { Server as HttpServer } from 'http';
// import { Server as IOServer } from 'socket.io';
// import productRoutes from './routes/products';
// import frontRoutes from './routes/front';
// import Archivo from './archivo.js';
// import ArchivosDB from './DB/archivoDb'
// import { sqlite3 as configSqlite } from './DB/config'

const express = require("express");
const exphbs = require('express-handlebars');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const Archivo = require('./controllers/archivo');
const { sqlite3:configSqlite } = require('../DB/config');
const ArchivoDB = require('../DB/archivoDb');
const archivoDB = new ArchivoDB(configSqlite);
// const archivo = new Archivo();

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
// const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer);

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
app.use("/nuevo-producto", frontRoutes);

let mostrados = 0
const listaProductos = []

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root:__dirname })
})

io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  socket.emit('productos', listaProductos)

  socket.on('boton', (data) => {
    listaProductos.push(data);
    console.log('boton presionado');
    mostrados++
    io.sockets.emit('productos', listaProductos.slice(0, mostrados))
  })


  // socket.emit('messages', await archivo.leer())
  socket.emit('messages', await archivoDB.crearTabla() );

  socket.on('new-message', async (data) => {
    let listaMensajes = await archivoDB.listar();
    const nuevoMensaje = {
      id: listaMensajes.length + 1,
      author: data.author,
      text:data.text
    };
    nuevoMensaje.date = new Date().toLocaleString();
    // await archivo.guardar(data.author, data.text)
    await archivoDB.insertar(nuevoMensaje);
    // io.sockets.emit('messages', await archivo.leer())
    io.sockets.emit('messages', await archivoDB.listar())
  })
})


const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

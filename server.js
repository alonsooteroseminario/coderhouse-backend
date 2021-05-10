const express = require("express");
const exphbs = require('express-handlebars');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const Archivo = require('./archivo');

// import express from 'express';
// import exphbs from 'express-handlebars';
// import { Server as HttpServer } from 'http';
// import { Server as IOServer } from 'socket.io';
// import productRoutes from './routes/products';
// import frontRoutes from './routes/front';
// import Archivo from './archivo.js';

const archivo = new Archivo();

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
    bold: options => {
      return '<div class = "mybold">' + options.fn(this) + "</div>";
    },
    mytitle: options => {
      return '<h2 class = "sarasa">' + options.fn(this) + "</h2>";
    },
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

app.use("/api/productos", productRoutes);
app.use("/api/nuevo-producto", frontRoutes);

let mostrados = 0
const listaProductos = []

app.get('/', (req, res) => {
  res.sendFile('index.html', { root:__dirname })
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

  socket.emit('messages', await archivo.leer())


  socket.on('new-message', async (data) => {

    await archivo.guardar(data.author, data.text)
    io.sockets.emit('messages', await archivo.leer())
  })
})


const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

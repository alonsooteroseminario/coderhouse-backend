const express = require("express");
const exphbs = require('express-handlebars');
// import express from 'express';
// import exphbs from 'express-handlebars';
// import { Server as HttpServer} from 'http';
// import { Server as Socket } from 'socket.io';

// import { router as productRoutes} from './routes/products';
// import { router as frontRoutes} from './routes/front';
const Product = require("./controllers/product");
const product = new Product();
const products = product.get();

const port = 8080;
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

// const http = require('http');
// const httpserver = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(httpserver);

// const httpserver = new HttpServer(app);
// const io = new Socket(httpserver);

var hbs = exphbs.create({
  extname: "hbs",
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
app.use(express.static("public"));

app.use("/api/productos", productRoutes);

app.use("/api/nuevo-producto", frontRoutes);

io.on('connection', socket => {
  console.log('Cliente conectado');
  socket.emit('productos', products);
  socket.on('boton', () => {
    socket.emit('productos', products);
  })
})

const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

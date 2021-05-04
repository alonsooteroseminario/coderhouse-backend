const express = require("express");
const exphbs = require('express-handlebars');
const productRoutes = require("./routes/products");
// const frontRoutes = require('./routes/front');
const Product = require("./controllers/product");
const product = new Product();

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

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
// app.use("/", frontRoutes);

const productos = [];

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  const productos = product.get()
  // socket.emit('productos', products);
  // socket.on('boton', () => {
  //   socket.emit('productos', products);
  // })

  //envie mensajes cuando se conecta
  socket.emit('mensajes', productos);
  socket.on('mensaje', data => {
    productos.push({ 
      socketid: socket.id,
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail
    });
    io.sockets.emit('mensajes', productos);
  })
})

const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

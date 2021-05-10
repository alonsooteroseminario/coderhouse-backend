const express = require("express");
const exphbs = require('express-handlebars');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const Archivo = require('./archivo');
const archivo = new Archivo();

const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

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

// aqui hay que leer()
// const messages = [  {
//   author: "alonsooteroseminario@gmail.com",
//   text: "Hola, ¿cómo estás?",
//   id: 1,
// },
// {
//   author: "luis_alo13@hotmail.com",
//   text: "Todo super bien, ¿tú, como estás?",
//   id: 2,
// },
// {
//   author: "alonsooteroseminario@gmail.com",
//   text: "Genial, yo también muy bien",
//   id: 3,
// }];

let messages = [];
messages = archivo.leer();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root:__dirname })
})

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('productos', listaProductos)

  socket.on('boton', (data) => {
    listaProductos.push(data);
    console.log('boton presionado');
    mostrados++
    io.sockets.emit('productos', listaProductos.slice(0, mostrados))
  })

  socket.emit('messages', messages)


  socket.on('new-message', data => {
    messages.push(data)
    // aqui hay que guardar(data.author, data.text)
    archivo.guardar(data.author, data.text)
    io.sockets.emit('messages', messages)
  })
})


const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

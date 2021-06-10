const express = require("express");
const exphbs = require('express-handlebars');
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const { sqlite3:configSqlite } = require('./DB/config');
const ArchivoDB = require('./DB/archivoDb');
const archivoDB = new ArchivoDB(configSqlite);

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
})

io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  socket.emit('messages', await archivoDB.listar())

  socket.on('new-message', async (data) => {
    let listaMensajes = await archivoDB.listar();
    const nuevoMensaje = {
      id: listaMensajes.length + 1,
      author: data.author,
      text:data.text,
      date: new Date().toLocaleString()
    };
    listaMensajes.push(nuevoMensaje)
    await archivoDB.insertar(listaMensajes);
    io.sockets.emit('messages', listaMensajes)
  })
})

const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

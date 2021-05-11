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
    lowercase: function (s: string) { return s.toLowerCase(); },
    full_name: (firstname: string, lastname:string) => firstname + " " + lastname,
    bold: (options:any) => {
      return '<div class = "mybold">' + options.fn(this) + "</div>";
    },
    mytitle: (options:any) => {
      return '<h2 class = "sarasa">' + options.fn(this) + "</h2>";
    },
    ifeq: function(a:any,b:any,options:any) {
      if (a==b) { return options.fn(this);}
      return options.inverse(this);
    },
    ifnoteq: function(a:any,b:any,options:any) {
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

let mostrados:number = 0
const listaProductos:any = []

app.get('/', (req:any, res:any) => {
  res.sendFile('./public/index.html', { root:__dirname })
})

io.on('connection', async (socket:any) => {
  console.log('Cliente conectado');
  socket.emit('productos', listaProductos)

  socket.on('boton', (data:any) => {
    listaProductos.push(data);
    console.log('boton presionado');
    mostrados++
    io.sockets.emit('productos', listaProductos.slice(0, mostrados))
  })

  socket.emit('messages', await archivo.leer())


  socket.on('new-message', async (data:any) => {

    await archivo.guardar(data.author, data.text)
    io.sockets.emit('messages', await archivo.leer())
  })
})


const port = 8080;
const server = httpServer.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', (err:any) => console.log('Error message: ' + err));
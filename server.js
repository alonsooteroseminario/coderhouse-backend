const express = require("express");
const pug = require('pug');
const port = 8080;
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/productos", productRoutes);

app.use("/api/nuevo-producto", frontRoutes);

const server = app.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

const express = require("express");
const app = express();
const port = 8080;
const productRoutes = require("./routes/products");

let PRODUCTS_DB = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productRoutes);

const server = app.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));

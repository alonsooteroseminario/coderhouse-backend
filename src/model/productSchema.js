const mongoose = require('mongoose');

const esquemaProducto = new mongoose.Schema({
    id: { type: Number, require: true },
    title: { type: String, require: true, max: 100 },
    price: { type: String, require: true, max: 100 },
    thumbnail: { type: String, require: true, max: 100 }
  })
  
const daoProductos = mongoose.model('productos', esquemaProducto);

module.exports =  daoProductos;
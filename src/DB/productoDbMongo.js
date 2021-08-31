const mongoose = require('mongoose');
const daoProductos = require('../model/models/productSchema');
const DatabaseProductoDao = require("../model/DAOs/DatabaseProductoDao");
const productoDto = require ("../model/DTOs/productoDto");

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommercedesafios?retryWrites=true&w=majority';

// const url = 'mongodb://localhost:27017/ecommerce';

class ProductoDBMongo extends DatabaseProductoDao {
  constructor() {
    super()
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de productoDb');
      }
    })
  }
  insertar(productos) {
    return daoProductos.create(productos, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
        return true;
      }
    });
  }
  listar() {
    return daoProductos.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(res)
      }
    }).lean();
  }
  listarPorId(id) {
    let prodById = daoProductos.find({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    const myDto = productoDto(prodById)
    return myDto;
  }
  borrarPorId(id) {
    return daoProductos.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
  }
  actualizarPorId(id, data) {

    const nuevoTitle = data.title;
    const nuevoPrice = data.price;
    const nuevothumbnail = data.thumbnail;

    return daoProductos.updateOne({id: id}, {$set: {
      title: nuevoTitle,
      price: nuevoPrice,
      thumbnail: nuevothumbnail
    }}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
        return true;
      }
    });
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }
}

module.exports = ProductoDBMongo;
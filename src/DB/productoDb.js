const mongoose = require('mongoose');

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommercedesafios?retryWrites=true&w=majority';

// const url = 'mongodb://localhost:27017/ecommerce';

const esquemaProducto = new mongoose.Schema({
  id: { type: Number, require: true },
  title: { type: String, require: true, max: 100 },
  price: { type: String, require: true, max: 100 },
  thumbnail: { type: String, require: true, max: 100 }
})

const daoProductos = mongoose.model('productos', esquemaProducto);

class ProductoDB {
  constructor() {
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

  crearTabla() {
    return daoProductos.create({}, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
      }
    });
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
    return daoProductos.find({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
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

module.exports = ProductoDB;
// import knex from 'knex'
// const knex = require('knex');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ecommerce';

const esquemaMensaje = new mongoose.Schema({
  id: { type: Number, require: true },
  author: { type: String, require: true, max: 100 },
  text: { type: String, require: true, max: 100 },
  date: { type: String, require: true, max: 100 }
})
const daoMensajes = mongoose.model('mensajes', esquemaMensaje)

class ArchivoDB {
  constructor() {
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de archivoDb');
      }
    })
  }

  crearTabla() {
    return daoMensajes.create({}, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        console.log(res);
      }
    });
  }

  insertar(mensaje) {
    return daoMensajes.create(mensaje, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
      }
    });
  }

  listar() {
    return daoMensajes.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(res)
      }
    });
  }
  borrarPorId(id) {
    return daoMensajes.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
  }
  actualizarPorId(id, nuevoText) {
    return daoMensajes.updateOne({id: id}, {$set: {text: nuevoText}}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }
}

module.exports = ArchivoDB;
const mongoose = require('mongoose');
const daoMensajes = require('../model/models/mensajeSchema');
const BaseMensaje = require ('../repository/mensaje.repository.js');
const { denormalize, normalize, schema } = require('normalizr');

const user = new schema.Entity("users");
// Define your text schema
const text = new schema.Entity("text");
// Define your mensaje
const mensaje = new schema.Entity("mensaje", {
  author: user,
  text: text,
});
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});
//tiene que tener forma de normalizaData

class MensajeDB extends BaseMensaje {

  borrarPorId(id) {
    return daoMensajes.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        this.DB_MENSAJES = res;
      }
    });
  }
  actualizarPorId(id, nuevoText) {
    return daoMensajes.updateOne({id: id}, {$set: {text: nuevoText}}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        this.DB_MENSAJES = res;
      }
    });
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
  }
}

module.exports = MensajeDB;
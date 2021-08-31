const mongoose = require('mongoose');

const esquemaMensaje = new mongoose.Schema({
    entities: {
      users: { 
        id: { type: String, require: true, max: 1000 },
        nombre: { type: String, require: true, max: 1000 },
        apellido: { type: String, require: true, max: 1000 },
        edad: { type: String, require: true, max: 1000 },
        alias: { type: String, require: true, max: 1000 },
        avatar: { type: String, require: true, max: 1000 },
       },
      text: { 
        id: { type: Number, require: true },
        text: { type: String, require: true, max: 1000 },
       },
      mensaje: { 
        id: { type: Number, require: true },
        author: { type: String, require: true, max: 1000 },
        text: { type: Number, require: true },
        date: { type: String, require: true, max: 1000 },
       },
      mensajes: { 
        id: { type: String, require: true, max: 1000 },
        mensajes: { type: Number, require: true },
       },
    },
    result: { type: String, require: true, max: 1000 },
  })
  
const daoMensajes = mongoose.model('mensajes', esquemaMensaje)

module.exports = daoMensajes;
  
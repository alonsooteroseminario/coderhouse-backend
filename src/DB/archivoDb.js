const mongoose = require('mongoose');
const { normalize, schema } = require('normalizr');
const utils = require('util');

const url = 'mongodb://localhost:27017/ecommerce';

const user = new schema.Entity('users');
const text = new schema.Entity("text", {
  commenter: user,
});
const mensaje = new schema.Entity("mensaje", {
  author: user,
  text: text,
});
const mensajes = new schema.Entity("mensajes", {
  mensajes: [mensaje],
});



const esquemaMensaje = new mongoose.Schema({
  id: { type: Number, require: true },
  author: { type: String, require: true, max: 1000 },
  text: { type: String, require: true, max: 1000 },
  date: { type: String, require: true, max: 1000 }
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
        this.DB_MENSAJES = this.listar();
      }
    })
  }

  insertar(mensaje) {
    //normalizar aqui
    const normalizedData = normalize(mensaje, mensajes);
    return daoMensajes.create(normalizedData, (err,res) => {
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

module.exports = ArchivoDB;
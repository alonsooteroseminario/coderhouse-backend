const mongoose = require('mongoose');
const { denormalize, normalize, schema } = require('normalizr');
const utils = require('util');

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommercedesafios?retryWrites=true&w=majority';

// const url = 'mongodb://localhost:27017/ecommerce';


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

  insertar(normalizedData) {
    
    const texts = normalizedData.entities.text;
    // console.log(texts);

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
        // console.log("/* -------------- NORMALIZED ------------- */");
        // const normalizedData = res;
        // console.log(normalizedData);

        
        // const denormalizedData = denormalize(
        //       normalizedData.result,
        //       mensajes,
        //       normalizedData.entities
        // );
        // console.log("/* -------------- DENORMALIZED denormalizedData.mensajes ------------- */");
        // console.log(denormalizedData);
        
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
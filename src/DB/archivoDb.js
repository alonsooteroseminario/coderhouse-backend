const mongoose = require('mongoose');
const { denormalize, normalize, schema } = require('normalizr');
const utils = require('util');

const url = 'mongodb://localhost:27017/ecommerce';

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

const esquemaMensaje = new mongoose.Schema({
  id: { type: Number, require: true },
  author: {
    id: { type: String, require: true, max: 1000 },
    nombre: { type: String, require: true, max: 1000 },
    apellido: { type: String, require: true, max: 1000 },
    edad: { type: Number, require: true },
    alias: { type: String, require: true, max: 1000 },
    avatar: { type: String, require: true, max: 1000 },
  },
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

  insertar(normalizedData) {

  
    // console.log("/* -------------- originalData string------------- */");
    // console.log(utils.inspect(originalData, false, 3, true))// string
    // console.log(utils.inspect(originalData, false, 3, true).length)// string
    //normalizar aqui
    // console.log(mensaje)

    // console.log(utils.inspect(normalizedData, false, 5, true));
    // console.log("length", JSON.stringify(normalizedData).length);

    // console.log(normalizedData.entities.mensajes)
    // console.log(normalizedData.entities);

    // console.log(utils.inspect(normalizedData, false, 6, true));// string
    // console.log("originalData length", JSON.stringify(originalData).length);
    // console.log("normalizedData length", JSON.stringify(normalizedData).length);
 

    // console.log(utils.inspect(normalizedData, false, 6, true).length);// string
    console.log("/* -------------- DENORMALIZED ------------- */");
    const denormalizedData = denormalize(
        normalizedData.result,
        mensajes,
        normalizedData.entities
    );
    console.log(denormalizedData);
    console.log("/* -------------- ARRAY DE MENSAJES ------------- */");
    console.log(denormalizedData.mensajes);
    // console.log("denormalizedData length", JSON.stringify(denormalizedData).length);
    // console.log(utils.inspect(denormalizedData, false, 1, true)); // string
  
    //aqui tiene que entrar un objeto
    return daoMensajes.create(denormalizedData, (err,res) => {
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
        // const normalizedData = res;
        // console.log("/* -------------- DENORMALIZED ------------- */");

        // const denormalizedData = denormalize(
        //     normalizedData.result,
        //     mensajes,
        //     normalizedData.entities
        // );
        // console.log(denormalizedData);
        // console.log("/****************************************/");
        // console.log(utils.inspect(denormalizedData, false, 3, true)); // string
        // return denormalizedData;
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
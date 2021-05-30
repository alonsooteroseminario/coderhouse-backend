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
  constructor(config) {
    // this.knex = knex(config)
    mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor');
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
    // return this.knex.schema.dropTableIfExists('mensajes')
    //   .then(() => {
    //     return this.knex.schema.createTable('mensajes', table => {
    //       table.increments('id').primary();
    //       table.string('author').notNullable();
    //       table.string('text');
    //       table.string('date');
    //     })
    //   })
  }

  insertar(mensaje) {
    return daoMensajes.create(mensaje, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        console.log(res);
      }
    });
    // return this.knex('mensajes').insert(mensaje)
  }

  listar() {
    return daoMensajes.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex('mensajes').select()
  }
  borrarPorId(id) {
    return daoMensajes.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex.from('mensajes').where('id', id).del()
  }
  actualizarPorId(id, nuevoText) {
    return daoMensajes.updateOne({id: id}, {$set: {text: nuevoText}}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex.from('mensajes').where('id', id).update({ text: nuevoText })
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
    // return this.knex.destroy()
  }
}

module.exports = ArchivoDB;
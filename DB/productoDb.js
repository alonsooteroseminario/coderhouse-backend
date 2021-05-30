// import knex from 'knex'
const knex = require('knex');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ecommerce';

class ProductoDB {
  constructor(config) {
    this.knex = knex(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
      .then(() => {
        return this.knex.schema.createTable('productos', table => {
          table.increments('id').primary();
          table.string('title').notNullable();
          table.float('price');
          table.integer('thumbnail');
        })
      })
  }

  insertar(productos) {
    return this.knex('productos').insert(productos)
  }

  listar() {
    return this.knex('productos').select()
  }

  listarPorId(id) {
    return this.knex.from('productos').where('id', id).select()
  }

  borrarPorId(id) {
    return this.knex.from('productos').where('id', id).del()
  }
  actualizarPorId(id, data) {

    const nuevoTitle = data.title;
    const nuevoPrice = data.price;
    const nuevothumbnail = data.thumbnail;

    return this.knex.from('productos').where('id', id).update({
      title: nuevoTitle,
      price: nuevoPrice,
      thumbnail: nuevothumbnail
    })
  }
  cerrar() {
    return this.knex.destroy()
  }
}

module.exports = ProductoDB;
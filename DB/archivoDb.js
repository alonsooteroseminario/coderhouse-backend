// import knex from 'knex'
const knex = require('knex');

class ArchivoDB {
  constructor(config) {
    this.knex = knex(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('mensajes')
      .then(() => {
        return this.knex.schema.createTable('mensajes', table => {
          table.increments('id').primary();
          table.string('author').notNullable();
          table.string('text');
          table.string('date');
        })
      })
  }

  insertar(mensaje) {
    return this.knex('mensajes').insert(mensaje)
  }

  listar() {
    return this.knex('mensajes').select()
  }
  borrarPorId(id) {
    return this.knex.from('mensajes').where('id', id).del()
  }
  actualizarStockPorId(id, nuevoText) {
    return this.knex.from('mensajes').where('id', id).update({ text: nuevoText })
  }
  cerrar() {
    return this.knex.destroy()
  }
}

module.exports = ArchivoDB;
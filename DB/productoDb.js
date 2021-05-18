// import knex from 'knex'
const knex = require('knex');

class ProductoDB {
  constructor(config) {
    this.knex = knex(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
      .then(() => {
        return this.knex.schema.createTable('productos', table => {
          table.increments('id').primary();
          table.string('nombre').notNullable();
          table.string('codigo').notNullable();
          table.float('precio');
          table.integer('stock');
        })
      })
  }

  insertar(productos) {
    return this.knex('productos').insert(productos)
  }

  listar() {
    return this.knex('productos').select()
  }
  borrarPorId(id) {
    return this.knex.from('productos').where('id', id).del()
  }
  actualizarStockPorId(id, nuevoStock) {
    return this.knex.from('productos').where('id', id).update({ stock: nuevoStock })
  }
  cerrar() {
    return this.knex.destroy()
  }
}

export default ProductoDB
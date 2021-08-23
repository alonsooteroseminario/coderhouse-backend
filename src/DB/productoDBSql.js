const knex = require('knex');

class ProductoDBSql {

  constructor(config) {
    this.knex = knex(config)
    this.knex.schema.hasTable('productos')
    .then((exists) =>{
      if(!exists){
        return this.knex.schema.createTable('productos', table => {
          table.increments('id').primary();
          table.string('title').notNullable();
          table.string('price');
          table.string('thumbnail');
        })
      }
    })
  }

  insertar (data) {
    const producto = {
      title: data[data.length-1].title,
      price: data[data.length-1].price,
      thumbnail: data[data.length-1].thumbnail
    }
    return this.knex('productos').insert(producto);
  }

  listar () {
    return this.knex('productos').select();
  }

  listarPorId(id) {
    return this.knex.from('productos').where('id', id).select();
  }

  actualizarPorId(id, data) {

    const nuevoTitle = data[data.length-1].title;
    const nuevoPrice = data[data.length-1].price;
    const nuevoThumbnail = data[data.length-1].thumbnail;

    return this.knex.from('productos').where('id', id).update({
      id: id,
      title: nuevoTitle,
      price: nuevoPrice,
      thumbnail: nuevoThumbnail,
    })
  }

  borrarPorId(id) {
    return this.knex.from('productos').where('id', id).del()
  }

  cerrar() {
    return this.knex.destroy();
  }

}

module.exports = ProductoDBSql;
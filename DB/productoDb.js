// import knex from 'knex'
// const knex = require('knex');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ecommerce';

const esquemaProducto = new mongoose.Schema({
  id: { type: Number, require: true },
  title: { type: String, require: true, max: 100 },
  price: { type: String, require: true, max: 100 },
  thumbnail: { type: String, require: true, max: 100 }
})

const daoProductos = mongoose.model('productos', esquemaProducto);

class ProductoDB {
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
    // return this.knex.schema.dropTableIfExists('productos')
    //   .then(() => {
    //     return this.knex.schema.createTable('productos', table => {
    //       table.increments('id').primary();
    //       table.string('title').notNullable();
    //       table.float('price');
    //       table.integer('thumbnail');
    //     })
    //   })
  }

  insertar(producto) {
    return daoProductos.create(producto, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        console.log(res);
      }
    });
    // return this.knex('productos').insert(productos)
  }

  listar() {
    return daoProductos.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex('productos').select()
  }

  listarPorId(id) {
    return daoProductos.find({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex.from('productos').where('id', id).select()
  }

  borrarPorId(id) {
    return daoProductos.deleteOne({id: id}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });
    // return this.knex.from('productos').where('id', id).del()
  }
  actualizarPorId(id, data) {

    const nuevoTitle = data.title;
    const nuevoPrice = data.price;
    const nuevothumbnail = data.thumbnail;

    return daoProductos.updateOne({id: id}, {$set: {
      title: nuevoTitle,
      price: nuevoPrice,
      thumbnail: nuevothumbnail
    }}, (err,res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    });

    // return this.knex.from('productos').where('id', id).update({
    //   title: nuevoTitle,
    //   price: nuevoPrice,
    //   thumbnail: nuevothumbnail
    // })
  }
  cerrar() {
    mongoose.disconnect(err => { console.log('desconectado de la base') });
    // return this.knex.destroy()
  }
}

module.exports = ProductoDB;
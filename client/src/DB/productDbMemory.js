const DatabaseProductoDao = require("../model/DAOs/DatabaseProductoDao");
const productoDto = require ("../model/DTOs/productoDto");
let PRODUCTS_DB = [];

class ProductDbMemory extends DatabaseProductoDao {
    constructor() {
        super()
        this.PRODUCTS_DB = PRODUCTS_DB;
    }
    insertar (data) {
        this.PRODUCTS_DB = data;
        return true;
    }
    listar () {
        return this.PRODUCTS_DB;
    }
    listarPorId (id) {
        let prodById = this.PRODUCTS_DB.filter( (producto) => producto.id === parseInt(id) )[0];
        const myDto = productoDto(prodById)
        return myDto;
    }
    borrarPorId(id) {
        this.PRODUCTS_DB = this.PRODUCTS_DB.filter((producto) => producto.id !== parseInt(id));
    }
    actualizarPorId(id, data) {
        this.PRODUCTS_DB = this.PRODUCTS_DB.map( (producto) => {
            if ( producto.id === parseInt(id) ) {
                producto.title = data.title
                producto.price = parseInt(data.price)
            }
            return producto;
        });
        return true;
    }
}

module.exports = ProductDbMemory;
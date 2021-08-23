let PRODUCTS_DB = [];

class ProductDbMemory {
    constructor() {
        this.PRODUCTS_DB = PRODUCTS_DB;
    }
    insertar (data) {
        // if(data.title === "" || typeof data.title === "undefined") return false;
        // if(data.price === "" || typeof data.price === "undefined") return false;
        // data.id = PRODUCTS_DB.length + 1;
        // console.log(data)
        // this.PRODUCTS_DB.push({
        //     id: data.id,
        //     title: data.title,
        //     price: parseInt(data.price),
        //     thumbnail: data.thumbnail,
        // });
        this.PRODUCTS_DB = data;
        return true;
    }
    listar () {
        // if (this.PRODUCTS_DB.length<1) return false
        return this.PRODUCTS_DB;
    }
    listarPorId (id) {
        return this.PRODUCTS_DB.filter( (producto) => producto.id === parseInt(id) )[0];
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
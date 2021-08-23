const fs = require('fs');

let PRODUCTS_DB = [];

class ProductDbFileSystem {
    constructor() {
        this.PRODUCTS_DB = fs.readFile('datos.txt', 'utf-8', (err, data)=>{
            if (err) {
                console.log(err)
                console.log('AQUI')
            }else{
                this.PRODUCTS_DB = JSON.parse(data);
            }
        })
    }

    insertar (data) {
        try {
            this.PRODUCTS_DB = data;
            fs.writeFileSync('datos.txt', JSON.stringify(this.PRODUCTS_DB))
            return true;
        }
        catch(error) {
            console.log(error)
        }
    }
    listar () {
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

module.exports = ProductDbFileSystem;
let PRODUCTS_DB = [];

class Product {
    constructor() {}

    add (data) {
        if(data.title === "" || typeof data.title === "undefined") return false;
        if(data.price === "" || typeof data.price === "undefined") return false;
        data.id = PRODUCTS_DB.length + 1;
        PRODUCTS_DB.push({
            id: data.id,
            title: data.title,
            price: parseInt(data.price),
            thumbnail: data.thumbnail,
        });
        return true;
    }

    get () {
        if (PRODUCTS_DB.length<1) return false
        return PRODUCTS_DB;
    }

    getById (id) {
        return PRODUCTS_DB.filter( (producto) => producto.id === parseInt(id) )[0];
    }

    update(id, data) {
        PRODUCTS_DB = PRODUCTS_DB.map( (producto) => {
            if ( producto.id === parseInt(id) ) {
                producto.title = data.title
                producto.price = parseInt(data.price)
            }
            return producto;
        });
        return true;
    }

    remove(id) {
        PRODUCTS_DB = PRODUCTS_DB.filter((producto) => producto.id !== parseInt(id));
    }
}

module.exports = Product;
function generarProducto() {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    thumbnail: faker.image.image(),
  }
}


class MockAPI {
    constructor(){
      this.PRODUCTS_DB = []
    }
    popular(n = 10) {
      this.PRODUCTS_DB = [];
      for (let i = 0; i < n; i++) {
        const producto = generarProducto();
        const nuevoproducto = {
          id: this.PRODUCTS_DB.length + 1,
          title: producto.title,
          price: producto.price,
          thumbnail: producto.thumbnail,
        }
        this.PRODUCTS_DB.push(nuevoproducto)
      }
    }
    agregar(producto) {
      this.PRODUCTS_DB.push(producto)
    }
    obtenerTodos() {
      return [...this.PRODUCTS_DB]
    }
    obtenerPorId(id) {
      return this.PRODUCTS_DB.find(u => u.id === id)
    }
}

module.exports = MockAPI;
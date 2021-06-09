const express = require('express');
const faker = require('faker');
faker.locale = 'es'
const router = express.Router();
const { mysql:configMysql } = require('./../DB/config');
const ProductoDB = require('./../DB/productoDb');
const productoDB = new ProductoDB(configMysql);

let PRODUCTS_DB = [];

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
const api = new MockAPI();


router.get("/vista", async (req, res) => {
  const products = await productoDB.listar();
  console.log(products.length)
  res.render('vista', {
    active: "vista",
    products: products
  });
  if (products.length == 0) {
    res.status(404).json({
      error: "no hay productos cargados",
    });
  }
});
  
router.get("/vista/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.listarPorId(id);

    if (currentProduct) {

      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
  });
  
router.post("/vista", async (req, res) => {
    const data = req.body;
    const products = await productoDB.listar();
    data.id = products.length + 1;
    products.push({
      id: data.id,
      title: data.title,
      price: parseInt(data.price),
      thumbnail: data.thumbnail,
    })

    if(await productoDB.insertar(products).catch((err)=>{
      console.log(err)
    })) {
      // if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
      res.redirect('http://localhost:8080/nuevo-producto').status(201).json(data);
    }
    res.status(400).send();
  });
  
router.put("/vista/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(await productoDB.actualizarPorId(id, data)) {

      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
router.delete("/vista/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.borrarPorId(id);
    res.json(currentProduct);
  });

router.get("/vista-test/:cant?", async (req, res) => {
  console.log(req.params.cant);
  if (req.params) {

    api.popular(req.params.cant);
    // res.json(api.obtenerPorId(req.params.id))
    const products = api.obtenerTodos();;
    res.render('vista', {
      active: "vista",
      products: products
    });



  } else {

    api.popular();
    const products = api.obtenerTodos();
    res.render('vista', {
      active: "vista",
      products: products
    })
    if (products.length == 0) {
      res.status(404).json({
        error: "no hay productos cargados",
      });
    }


  }
});

module.exports = router;
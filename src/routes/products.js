const express = require('express');
const faker = require('faker');
faker.locale = 'es'
const router = express.Router();
const ProductoDB = require('./../DB/productoDb');
const productoDB = new ProductoDB();
const MockAPI = require('../controllers/mockAPI');
const { transporter, transporterGmail } = require('../controllers/email');
const api = new MockAPI();

router.get("/vista", async (req, res) => {
  if (!req.user.contador) {
    req.user.contador = 0
  }
  const products = await productoDB.listar();
  res.render('vista', {
    active: "vista",
    products: products,
    user: req.user,
  });
  req.user.contador++
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
      res.redirect('http://localhost:8080/producto/nuevo-producto').status(201).json(data);
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

router.get('/nuevo-producto', async (req, res) => {
  if (!req.user.contador) {
      req.user.contador = 0
  }
  res.render('nuevo-producto', {
      active: 'nuevo-producto',
      user: req.user
  })
})

module.exports = router;
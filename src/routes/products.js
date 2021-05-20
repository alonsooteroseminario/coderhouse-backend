// import express from 'express';
// import Product from '../controllers/product';
const express = require('express');
const { convertToObject } = require('typescript');
const router = express.Router();
const { mysql:configMysql } = require('../../DB/config');
const ProductoDB = require('../../DB/productoDb');
const productoDB = new ProductoDB(configMysql);
const Product = require("../controllers/product");
const product = new Product();

const products = productoDB.listar()
if (products === null) {
  productoDB.crearTabla();
}



router.get("/", (req, res) => {
  // const products = product.get()
  const products = productoDB.listar().then((listado) => {
      console.table(listado)
    })
  res.render('vista', {
    active: "vista",
    products: products
  });
});

router.get("/", (req, res) => {
    // const products = product.get()
    const products = productoDB.listar();
    if (!products) {
      return res.status(404).json({
        error: "no hay productos cargados",
      });
    }
    res.json(products);
  });
  
router.get("/:id", (req, res) => {
    const { id } = req.params;
    // const currentProduct = product.getById(id)
    const currentProduct = productoDB.listarPorId(id);
    if (currentProduct) {
      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
  });
  
router.post("/", (req, res) => {
    const data = req.body;
    // const products = product.get()
    // if(product.add(data)) {
    //   if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
    //   res.status(201).json(data);
    //   res.render('nuevo-producto', {
    //     products: products
    //   })
    // }
    const products = productoDB.listar();
    console.log(products);
    delete data.form;
    data.id = products.length + 1;
    const nuevoObjeto = {
      id: data.id,
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail
    }
    console.log(nuevoObjeto);

    if(productoDB.insertar(nuevoObjeto)) {
      res.redirect('http://localhost:8080/nuevo-producto');
      res.status(201).json(nuevoObjeto);
      res.render('nuevo-producto', {
        products: products
      })
    }
    res.status(400).send();
  });
  
router.put("/:id", (req, res) => {
    const data = req.body;
    const { id } = req.params;
    // if(product.update(id, data)) {
    //   res.status(201).json(data);
    // }
    if(productoDB.actualizarPorId(id, data)) {
      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    // const currentProduct = product.getById(id)
    // product.remove(id);
    const currentProduct = productoDB.listarPorId(id);
    productoDB.borrarPorId(id);
    res.json(currentProduct);
  });

module.exports = router;
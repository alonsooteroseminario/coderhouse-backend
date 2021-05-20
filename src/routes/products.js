// import express from 'express';
// import Product from '../controllers/product';
const express = require('express');
const router = express.Router();
const { mysql:configMysql } = require('../../DB/config');
const ProductoDB = require('../../DB/productoDb');
const productoDB = new ProductoDB(configMysql);
const Product = require("../controllers/product");
const product = new Product();

router.get("/", (req, res) => {
  const products = product.get()
  // const products = productoDB.crearTabla().then(() => {
  //   return productoDB.listar();
  // })
  res.render('vista', {
    active: "vista",
    products: products
  });
});

router.get("/", (req, res) => {
    const products = product.get()
    // const products = productoDB.crearTabla().then(() => {
    //   return productoDB.listar();
    // })
    if (!products) {
      return res.status(404).json({
        error: "no hay productos cargados",
      });
    }
    res.json(products);
  });
  
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const currentProduct = product.getById(id)
    // const currentProduct = productoDB.listarPorId(id);
    if (currentProduct) {
      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
  });
  
router.post("/", (req, res) => {
    const data = req.body;
    const products = product.get()
    if(product.add(data)) {
      if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
      res.status(201).json(data);
      res.render('nuevo-producto', {
        products: products
      })
    }
    // const products = productoDB.crearTabla().then(() => {
    //   return productoDB.listar();
    // })
    // if(productoDB.insertar(data)) {
    //   if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
    //   res.status(201).json(data);
    //   res.render('nuevo-producto', {
    //     products: products
    //   })
    // }
    res.status(400).send();
  });
  
router.put("/:id", (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(product.update(id, data)) {
      res.status(201).json(data);
    }
    // if(productoDB.actualizarPorId(id, data)) {
    //   res.status(201).json(data);
    // }
    res.status(400).send();
  });
  
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const currentProduct = product.getById(id)
    // const currentProduct = productoDB.listarPorId(id);
    res.json(currentProduct);
    product.remove(id);
    // productoDB.borrarPorId(id);
  });

module.exports = router;
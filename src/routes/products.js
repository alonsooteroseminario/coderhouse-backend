// import express from 'express';
// import Product from '../controllers/product';
const express = require('express');
const router = express.Router();
const { mysql:configMysql } = require('../../DB/config');
const ProductoDB = require('../../DB/productoDb');
const productoDB = new ProductoDB(configMysql);
const Product = require("../controllers/product");
const product = new Product();

router.get("/", async (req, res) => {
  const products = product.get();
  await productoDB.insertar(products);
  const listado = await productoDB.listar();
  console.table(listado);

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
  
router.post("/", async (req, res) => {
    const data = req.body;
    const products = product.get()
    if(product.add(data)) {
      if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
      res.status(201).json(data);
      res.render('nuevo-producto', {
        products: products
      })
      await productoDB.insertar(products)
    }
    res.status(400).send();
  });
  
router.put("/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(product.update(id, data)) {
      await productoDB.actualizarPorId(id, data)
      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = product.getById(id)
    product.remove(id);
    await productoDB.borrarPorId(id);
    res.json(currentProduct);
  });

module.exports = router;
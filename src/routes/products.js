// import express from 'express';
// import Product from '../controllers/product';
const express = require('express');
const router = express.Router();
const { mysql:configMysql } = require('./../DB/config');
const ProductoDB = require('./../DB/productoDb');
const productoDB = new ProductoDB(configMysql);

let PRODUCTS_DB = [];

router.get("/", async (req, res) => {
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
  
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.listarPorId(id);

    if (currentProduct) {

      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
  });
  
router.post("/", async (req, res) => {
    const data = req.body;
    const products = await productoDB.listar();
    data.id = products.length + 1;
    products.push({
      id: data.id,
      title: data.title,
      price: parseInt(data.price),
      thumbnail: data.thumbnail,
    })

    if(await productoDB.insertar(products)) {
      if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
      res.status(201).json(data);
      res.render('nuevo-producto')
    }
    res.status(400).send();
  });
  
router.put("/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(await productoDB.actualizarPorId(id, data)) {

      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.borrarPorId(id);
    res.json(currentProduct);
  });

module.exports = router;
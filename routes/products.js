const express = require('express');
const router = express.Router();
const Product = require("../controllers/product");
const product = new Product();

let PRODUCTS_DB = [];

router.get("/", (req, res) => {
    const products = product.get()
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
    if (currentProduct) {
      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
  });
  
  router.post("", (req, res) => {
    const data = req.body;
    if(product.add(data)) {
      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
  router.put("/:id", (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(product.update(id, data)) {
      res.status(201).json(data);
    }
    res.status(400).send();
  });
  
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    product.remove(id);
    res.send();
  });

  module.exports = router;
// import express from 'express';
// import path from 'path';
// import Product from '../controllers/product';

const express = require('express');
const router = express.Router();
const path = require('path');

const Product = require("../controllers/product");

const product = new Product();


router.get('/', (req, res) => {
    const productos = product.get()
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        productos: productos
    })
})

module.exports = router;
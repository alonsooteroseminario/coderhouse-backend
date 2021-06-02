// import express from 'express';
// import path from 'path';
// import Product from '../controllers/product';

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('nuevo-producto', {
        active: 'nuevo-producto'
    })
})

module.exports = router;
// import express from 'express';
// import path from 'path';
// import Product from '../controllers/product';

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const data = req.body;
    console.log(data);
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        usuario: data.inputUser
    })
})

module.exports = router;
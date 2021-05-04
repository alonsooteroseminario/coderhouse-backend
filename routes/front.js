const express = require('express');
const router = express.Router();
// import express from 'express';
// import path from 'path';
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.resolve("views/nuevo-producto.html"));
})

module.exports = router;
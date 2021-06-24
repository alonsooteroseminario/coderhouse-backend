const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.user.contador) {
        req.user.contador = 0
    }
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        usuario: req.user.username
    })
})

module.exports = router;
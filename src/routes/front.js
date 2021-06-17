const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const nombre = req.session.inputUser;
    if (!nombre) {
        setTimeout(function(){ 
          res.redirect('http://localhost:8080/login');
        }, 2000);
    }else{
        res.render('nuevo-producto', {
            active: 'nuevo-producto',
            usuario: nombre
        })
    }
})

module.exports = router;
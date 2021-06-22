const express = require('express');
const router = express.Router();

this.nombre = '';

router.get('/login', (req, res) => {
  res.render('login')
})

let contador = 0
router.get('/sin-session', (req, res) => {
  res.json({ contador: ++contador })
})

router.post('/con-session', (req, res) => {
  const data = req.body;

  if (!req.session.contador) {
    req.session.contador = 1
    req.session.inputUser = data.inputUser;
    this.nombre = data.inputUser;
    res.redirect('http://localhost:8080/productos/vista');

  } else {
    req.session.contador++
    res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
  }
})

router.get('/logout', (req, res) => {
  const nombre = this.nombre;
  req.session.destroy(err => {
    if (err) {
      res.json({ status: 'Logout ERROR', body: err })
    } else {

      setTimeout(function(){ 
        res.redirect('http://localhost:8080/login');
      }, 2000);
    }
  })
})

module.exports = router;
const express = require('express');
const router = express.Router();

function showSession(req) {
    console.log('------------ req.session -------------')
    console.log(req.session)
  
    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
  
    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
  
    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
  }

router.get('/login', (req, res) => {
    const data = req.body;
    console.log(data);
    if (data.form === "1") {
        res.redirect('http://localhost:8080/productos/nuevo-producto').status(201);
    }
    res.render('login')
})

let contador = 0
router.get('/sin-session', (req, res) => {
  res.json({ contador: ++contador })
})

router.get('/con-session', (req, res) => {
  showSession(req)
  if (!req.session.contador) {
    req.session.contador = 1
    res.send('Bienvenido!')
  } else {
    req.session.contador++
    res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ status: 'Logout ERROR', body: err })
    } else {
      res.send('Logout ok!')
    }
  })
})

router.get('/info', (req, res) => {
  showSession(req)
  res.send('Send info ok!')
})

module.exports = router;
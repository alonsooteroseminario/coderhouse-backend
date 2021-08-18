const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
    username: { type: String, require: true, max: 100 },
    facebookId: { type: String, require: true},
    email: { type: String, require: true, max: 100 },
    foto: { type: String, require: true},
  })
  
const daoUsuarios = mongoose.model('usuarios', esquemaUsuario);
  
module.exports =  daoUsuarios;
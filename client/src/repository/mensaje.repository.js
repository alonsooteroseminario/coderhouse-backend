const MongoCxn = require("../DB/database/MongoCxn");
const daoMensajes = require('../model/models/mensajeSchema');

class BaseMensaje {
  constructor() {
    this.cxn = new MongoCxn();
  }

  insertar(normalizedData) {

    return daoMensajes.create(normalizedData, (err,res) => {
      if (err) {
        console.log(err);
      }else{
        // console.log(res);
      }
    });
  }
  listar() {
    return daoMensajes.find({}, (err,res) => {
      if (err) {
        console.log(err)
      } else {

      }
    });
  }
}

module.exports = BaseMensaje;

const MongoCxn = require("../DB/database/MongoCxn");

class BaseMensaje {
  constructor() {
    this.cxn = new MongoCxn();
  }

  // async addMsgPersistence(mensaje) {
  //   try {
  //     const newMsg = await daoMensajes.create(mensaje);
  //     return newMsg;
  //   } catch (error) {

  //   }
  // }



  // async findAllMsgPersistence() {
  //   try {
  //     const mensajes = await daoMensajes.find();
  //     return mensajes;
  //   } catch (error) {

  //   }
  // }

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

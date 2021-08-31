const mongoose = require("mongoose");

const admin = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

class MongoCxn {
  constructor() {
    if (MongoCxn.instancia) {
      return MongoCxn.instancia;
    }

    this.connection = this.createConnection();
    MongoCxn.instancia = this;
  }

  createConnection() {
    const url = 'mongodb+srv://'+admin.toString()+':'+password.toString()+'@cluster0.rzdyo.mongodb.net/ecommercedesafios?retryWrites=true&w=majority';
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
    mongoose.connect(url, options, (err) => {
      if (err) {
        console.log(err);
      }else{
        console.log('Conectado a la base en constructor de mensajeDb');
      }
    })
  }
}

module.exports = MongoCxn;

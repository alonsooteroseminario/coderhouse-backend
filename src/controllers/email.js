const nodemailer = require('nodemailer');
require('dotenv').config();
/* --------------------- EMAILS Y MESSAGING --------------------------- */
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kadin.bernier77@ethereal.email',
        pass: 'Z5v8vjwSJjhsbUkyQQ'
    }
  });
  const transporterGmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alonsooteroseminario@gmail.com',
        pass: process.env.GMAIL_PASSWORD.toString()
    }
  });

  module.exports = {
    transporter,
    transporterGmail
  };
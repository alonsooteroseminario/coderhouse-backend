const socket = io.connect();
const Product = require("../../controllers/product");
const product = new Product();

const productos = [];
const input_title = document.getElementById("input_title");
const input_price = document.getElementById("input_price");
const input_thumbnail = document.getElementById("input_image");

document.querySelector("button").addEventListener("click", () => {
    const productos = product.get();
    socket.emit('mensaje', productos);
})

socket.on('mensajes', msjs => {
    const mensajeHTML = msjs.map(msj => `SocketId: ${msj.socketid} -> Mensaje: ${msj.title} + ${msj.price} + ${msj.thumbnail}`).join('<br>')
    document.querySelector('p').innerHTML = mensajeHTML;
})
const socket = io.connect();

// const productoTemplate = Handlebars.compile("<li>Title: {{titleProducto}}</li>");

// document.getElementById('miBoton').addEventListener('click', () => {
//     socket.emit('boton')
// })

// socket.on('productos', products => {
//     const productosHtml = []
//     for (const prod of products) {
//         const elhtml = productoTemplate( { titleProducto: prod.title });
//         productosHtml.push(elhtml);
//     }
//     const elhtml = `<ul>${productosHtml.join('')}</ul>`
//     document.getElementById('productos').innerHTML = elhtml;
// })

const input = document.querySelector('input');

document.querySelector("button").addEventListener("click", () => {
    socket.emit('mensaje', input.value);
})

socket.on('mensajes', msjs => {
    const mensajeHTML = msjs.map(msj => `SocketId: ${msj.socketid} -> Mensaje: ${msj.mensaje}`).join('<br>')
    document.querySelector('p').innerHTML = mensajeHTML;
})
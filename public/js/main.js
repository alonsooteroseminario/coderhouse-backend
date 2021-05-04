const socket = io.connect();

const productoTemplate = Handlebars.compile("<li>Title: {{titleProducto}}</li>");


// document.getElementById('miBoton').addEventListener('click', () => {
//     const elhtml = productoTemplate({ unValor: 'coso'});
//     document.getElementById('productos').innerHTML = elhtml;
// })

document.getElementById('miBoton').addEventListener('click', () => {
    socket.emit('boton')
})

socket.on('productos', products => {
    const productosHtml = []
    for (const prod of products) {
        const elhtml = productoTemplate( { titleProducto: prod.title });
        productosHtml.push(elhtml);
    }
    const elhtml = `<ul>${productosHtml.join('')}</ul>`
    document.getElementById('productos').innerHTML = elhtml;
})
const socket = io.connect();

const prodStrTemplate = "<li>title: {{title}} - price: {{price}}</li>";
const productoTemplate = Handlebars.compile(prodStrTemplate);


document.getElementById('miBoton').addEventListener('click', () => {
    socket.emit('boton')
})

socket.on('productos', async (productos) => {
    const productosHtml = []
    if (productos.length) {
        for (const {title, price} of productos) {
            const elhtml = productoTemplate( {title, price} );
            productosHtml.push(elhtml);
        }
        const elhtml = `<ul>${productosHtml.join('')}</ul>`
        document.getElementById('productos').innerHTML = elhtml;
    }
    else{
        document.getElementById('productos').innerHTML = '<p>nada pra mostrar</p>';
    }
})
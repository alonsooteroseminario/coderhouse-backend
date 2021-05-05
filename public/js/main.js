const socket = io.connect();

const prodStrTemplate = "<li>title: {{title}} - price: {{price}}</li>";
const productoTemplate = Handlebars.compile(prodStrTemplate);


document.getElementById('miBoton').addEventListener('click', () => {
    const producto = {
        title: document.getElementById('input-title').value,
        price: document.getElementById('input-price').value,
        thumbnail: document.getElementById('input-thumbnail').value
      };
      socket.emit('boton', producto);
  
      document.getElementById('input-title').value = ''
      document.getElementById('input-price').value = ''
      document.getElementById('input-thumbnail').value = ''
      document.getElementById('input-title').focus()
})


socket.on('productos', data => {
    const productosHtml = []
    if (data.length) {
        for (const {title, price} of data) {
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

// function addData(e) {
//     const producto = {
//       title: document.getElementById('input-title').value,
//       price: document.getElementById('input-price').value
//     };
//     socket.emit('boton', producto);

//     document.getElementById('input-title').value = ''
//     document.getElementById('input-price').value = ''
//     document.getElementById('input-title').focus()

//     return false;
// }

const socket = io();

function pickForm(e) {
    const producto = {
        title: document.getElementById('input-title').value,
        price: document.getElementById('input-price').value,
        thumbnail: document.getElementById('input-thumbnail').value
      };
      socket.emit('boton', producto);
    return false;
}

const inicioStrTable = `
<table class="table">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">title</th>
        <th scope="col">price</th>
        <th scope="col">thumbnail</th>
        </tr>
    </thead>
    <tbody>`
const prodStrTemplate = `
        <tr>
            <th scope="row">{{id}}</th>
            <td>{{title}}</td>
            <td>{{price}}</td>
            <td>
                <img class="img-thumbnail" src={{{thumbnail}}} alt="" />
            </td>
        </tr>`;
const finStrTable = `
    </tbody>
</table>`
const productoTemplate = Handlebars.compile(prodStrTemplate);

socket.on('productos', data => {
    const productosHtml = []
    if (data.length > 0) {
        for (const {title, price, thumbnail} of data) {
            const elhtml = productoTemplate( {title, price, thumbnail} );
            productosHtml.push(elhtml);
        }
        const elhtml = inicioStrTable +
                        `<ul>${productosHtml.join('')}</ul>` +
                        finStrTable;
        document.getElementById('productos').innerHTML = elhtml;
    }
    else{
        document.getElementById('productos').innerHTML = '<p>nada para mostrar</p>';
    }
})


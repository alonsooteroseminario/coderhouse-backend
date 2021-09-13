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
socket.on('messages', data => {
    //desnomalizar aqui
    // console.log(data)

    render(data);
});
function render(data) {

    const html = data.map((elem, index) => {
        return(`<div style="color:rgb(128,64,0);">
                <strong style="color:rgb(0,0,255);">${elem.author.id}</strong>
                [(${elem.date})]:
                <em style="color:rgb(0,143,57);">${elem.text.text}</em> 
                <img class="card-img-top" src="${elem.author.avatar}" alt="Card image cap">
                </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}
function addMessage(e) {
    console.log(e)
    const data = {
      author: {
        id: document.getElementById('username').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        edad: document.getElementById('edad').value,
        alias: document.getElementById('alias').value,
        avatar: document.getElementById('avatar').value
      },
      text: document.getElementById('texto').value,
    };

    socket.emit('new-message', data);
    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}


var query = `{ productos {
    id
    title
    price
    thumbnail
}}`
var variables = {}
let verProdHtml = (data) => {

    const headHtmlTable = `<table id="tbodyGraphql" class="table">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">title</th>
                                    <th scope="col">price</th>
                                    <th scope="col">thumbnail</th>
                                    </tr>
                                </thead>
                                <tbody>`                            
    let html = Object.values(Object.values(data)[0])[0].map(producto => {

        return(`
                                    <tr>

                                        <th scope="row">${producto.id}</th>
                                        <td>${producto.title}</td>
                                        <td>${producto.price}</td>
                                        <td>
                                            <img class="img-thumbnail" src="${producto.thumbnail}" alt="" />
                                        </td>

                                    </tr>
            `)
    })
    const finalHtmlTable = `    </tbody>
                            </table>` 
    document.getElementById('tableGraphql').innerHTML = headHtmlTable + html + finalHtmlTable;

};
const fetchData = async () => {
    const res = await fetch('http://localhost:8080/productos/graphql', {
        method: 'POST',
        headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
        body: JSON.stringify({
                    query,
                    variables 
                })
    });
    const data = await res.json();
    verProdHtml(data);
};
document.addEventListener('DOMContentLoaded', e => { fetchData() });

// getElementById
let newTitle = document.getElementById('input-title');
let newPrice = document.getElementById('input-price');
let newThumbnail = document.getElementById('input-thumbnail');

// mutation & variables para agregar producto
var mutation = `mutation{
    agregarProductoGraphql(title: ${newTitle}, price: ${newPrice}, thumbnail: ${newThumbnail}) {
      title
      price
      thumbnail
    }
}`
const fetchPOSTdata = async () => {
    const res = await fetch('http://localhost:8080/productos/graphql', {
        method: 'POST',
        headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
        body: JSON.stringify({
                    mutation,
                    variables 
                })
    });
    // const data = await res.json();
}
// event listener, ejecutar  funcion() para traer info del formulario
let botonProductoNuevo = document.getElementById('miBoton');
botonProductoNuevo.addEventListener('click', () => { fetchPOSTdata() });





import express from 'express';
import fs from 'fs';
const app = express();

let visitasItems = 0;
let visitasItemsRandom = 0;
let filepath = './archivos/productos.txt';

const port = 8080;

const main = () => {
    app.get('/items', (req, res) => {
        visitasItems++;
        const productos = fs.readFileSync(filepath, 'utf-8');
        const array = JSON.parse(productos);
        res.json([
            {
                items: array, //llamar al archivo de texto
                cantidad: array.length
            },
        ])
    })
    app.get('/item-random', (req, res) => {
        visitasItemsRandom++;
        const productos = fs.readFileSync(filepath, 'utf-8');
        const array = JSON.parse(productos);
        res.json([
            {
                item: array[Math.floor(Math.random() * array.length)],// llamar a 1 item al azar del archivo de texto
            },
        ])
    })
    app.get('/visitas', (req, res) => {
        res.json([
            {
                visitas: {
                    items: visitasItems,
                    item: visitasItemsRandom,
                }
            },
        ])
    })
    const server = app.listen(port, () => {
        console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
    });
    server.on('error', err => console.log('Error message: ' + err));
}

main();



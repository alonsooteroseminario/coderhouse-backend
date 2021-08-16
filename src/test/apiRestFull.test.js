const supertest = require('supertest');
const request = supertest('http://localhost:8080');
const expect = require('chai').expect;


const id = '1'; //* id de producto como parametro debe ser reemplazado segun figure en mongodb Atlas
const url = '/productos/vista';
const urlModify = `/productos/vista/${id}`; 

const producto = {
    "title": 'Arroz Blanco', 
    "price": '21100',
    "thumbnail": 'https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png'
};

const price = 10000;

describe("Test API REST", ()=>{
    describe('test GET', () => {
        it('debería retornar un status 200', async()=> {
            let response = await request.get(url);
            expect(response.status).to.eql(200);
        })
    })

    describe('test POST', ()=> {
        it('debe incorporar un producto', async()=>{
            let response = await request.post(url).send(producto);
            expect(response.status).to.eql(200);
        })
    })

    describe('test update/PUT', ()=>{
        it('debe modificar el precio del producto (segun id ingreso)', async()=>{
            let response = await request.put(urlModify).send({price: price});
            expect(response.status).to.eql(200);
        })
    })

    describe('test delete/DELETE', ()=>{
        it('debe eliminar el producto (segun id ingreso)', async()=>{
            let response = await request.delete(urlModify).send();
            expect(response.status).to.eql(200);
        })
    })
});
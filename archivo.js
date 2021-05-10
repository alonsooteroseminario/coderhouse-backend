// import fs from 'fs';
const fs = require("fs");

class Archivo {
    constructor() {
        this.filepath = './archivos/mensajes.txt'
    }

    async leer () {

        try {
            const mensajes = await fs.promises.readFile(this.filepath, 'utf-8')
            return JSON.parse(mensajes);
        } catch (err) {
            return [];
        }
  
    }

    async borrar () {
        await fs.promises.unlink(this.filepath);
    }

    async guardar (author, text) {
        try {
            const mensajes = await this.leer()
            const nuevoMensaje = {
                author,
                text,
                id: mensajes.length + 1,
            };
            mensajes.push(nuevoMensaje);
            await fs.promises.writeFile(this.filepath, JSON.stringify(mensajes, null, 2));
            return `Se ha agregado el author ${author}`;
        } catch (err) {
            console.log('Ups. algo paso'. err);
        }

    }

}

module.exports = Archivo;

// const mainLeer = async () => {
//     const manejadorDeArchivos = new Archivo();
//     const salida = await manejadorDeArchivos.leer();
//     console.log("Leer: ", salida);
//     return salida;
// }

// const mainGuardar = async (author, text) => {
//     const manejadorDeArchivos = new Archivo();

//     console.log(await manejadorDeArchivos.guardar(author, text));
//     // console.log("Leer: ", await manejadorDeArchivos.leer());
// }

// module.exports = {
//     mainLeer, 
//     mainGuardar
// };
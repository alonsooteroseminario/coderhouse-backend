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
            let mensajes = await this.leer()
            const nuevoMensaje = {
                author,
                text,
                id: mensajes.length + 1
            };
            nuevoMensaje.date = new Date().toLocaleString();
            mensajes.push(nuevoMensaje);
            await fs.promises.writeFile(this.filepath, JSON.stringify(mensajes, null, 2));
            return `Se ha agregado el author ${author}`;
        } catch (err) {
            console.log('Ups. algo paso'. err);
        }

    }

}

module.exports = Archivo;
// export default Archivo;
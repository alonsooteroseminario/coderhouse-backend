// import fs from 'fs';
const fs = require("fs");

class Archivo {
    constructor() {
        this.filepath = './archivos/usuarios.txt'
    }

    async leer () {

        try {
            const usuarios = await fs.promises.readFile(this.filepath, 'utf-8')
            return JSON.parse(usuarios);
        } catch (err) {
            return [];
        }
  
    }

    async borrar () {
        await fs.promises.unlink(this.filepath);
    }

    async guardar (title, price, thumbnail) {
        try {
            const usuarios = await this.leer()
            const nuevoUsuario = {
                title,
                price,
                thumbnail,
                id: usuarios.length + 1,
            };
            usuarios.push(nuevoUsuario);
            await fs.promises.writeFile(this.filepath, JSON.stringify(usuarios, null, 2));
            return `Se ha agregado el usuario ${title}`;
        } catch (err) {
            console.log('Ups. algo paso'. err);
        }

    }
}


const main = async () => {
    const manejadorDeArchivos = new Archivo();
    console.log("Leer: ", await manejadorDeArchivos.leer());
    console.log(await manejadorDeArchivos.guardar("Producto1", 100, "https://romualdfons.com/wp-content/uploads/2017/03/QU%C3%89-ES-UN-DOMINIO.png"));
    console.log(await manejadorDeArchivos.guardar("Producto2", 200, "https://romualdfons.com/wp-content/uploads/2017/03/QU%C3%89-ES-UN-DOMINIO.png"));
    console.log(await manejadorDeArchivos.guardar("Producto3", 300, "https://romualdfons.com/wp-content/uploads/2017/03/QU%C3%89-ES-UN-DOMINIO.png"));
    console.log("Leer: ", await manejadorDeArchivos.leer());

    setTimeout( async () => {
        await manejadorDeArchivos.borrar();
    }, 5000);
    
    // console.log("Leer: ", await manejadorDeArchivos.leer());
}

main();
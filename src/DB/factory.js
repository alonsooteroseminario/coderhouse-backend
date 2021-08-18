const ProductoDBMongo = require('../controllers/productoDbMongo')
/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryPersonaModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            // case 'Mem': return new persistenciaMemory()
            // case 'File': return new persistenciaFileSystem()
            case 'Mongo': return new ProductoDBMongo()
        }
    }
}

const opcion = process.argv[2] || 'Mongo';

module.exports = FactoryPersonaModel.set(opcion);
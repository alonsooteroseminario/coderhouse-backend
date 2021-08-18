const ProductoDBMongo = require('../controllers/productoDbMongo');
const ProductDbMemory = require('../controllers/productDbMemory');
/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryPersonaModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new ProductDbMemory()
            // case 'File': return new persistenciaFileSystem()
            case 'Mongo': return new ProductoDBMongo()
        }
    }
}

const opcion = process.argv[2] || 'Mem';

module.exports = FactoryPersonaModel.set(opcion);
const ProductoDBMongo = require('../controllers/productoDbMongo');
const ProductDbMemory = require('../controllers/productDbMemory');
const ProductDbFileSystem = require('../controllers/productDbFileSystem');
const ProductoDBSql = require('../controllers/productoDBSql');
const {mysqlDBaaS} = require('../DB/config')

/* -------------------------------------- */
/*                FACTORY                 */
/* -------------------------------------- */
class FactoryPersonaModel {
    static set(opcion) {
        console.log('**** PERSISTENCIA SELECCIONADA **** [' + opcion + ']')
        switch(opcion) {
            case 'Mem': return new ProductDbMemory()
            case 'File': return new ProductDbFileSystem()
            case 'Mongo': return new ProductoDBMongo()
            case 'Sql': return new ProductoDBSql(mysqlDBaaS)
        }
    }
}


const opcion = process.argv[2] || 'Mem';

module.exports = FactoryPersonaModel.set(opcion);
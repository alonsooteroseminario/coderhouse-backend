const ProductoDBMongo = require('./productoDbMongo');
const ProductDbMemory = require('./productDbMemory');
const ProductDbFileSystem = require('./productDbFileSystem');
const ProductoDBSql = require('./productoDBSql');
const {mysqlDBaaS} = require('../config/config')

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


const opcion = process.argv[2] || process.env.OPCION || 'Mem';

module.exports = FactoryPersonaModel.set(opcion);
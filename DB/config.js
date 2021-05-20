const mysql = {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'productos'
    }
  }
const sqlite3 = {
    client: 'sqlite3',
    connection: { filename: './DB/mensajes.sqlite' },
    useNullAsDefault: true
}
module.exports = { mysql, sqlite3 };
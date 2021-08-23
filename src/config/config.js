require('dotenv').config();

const mysqlDBaaS = {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_ADDON_HOST.toString(),
      user: process.env.MYSQL_ADDON_USER.toString(),
      password: process.env.MYSQL_ADDON_PASSWORD.toString(),
      database: process.env.MYSQL_ADDON_DB.toString()
    }
}

module.exports = {mysqlDBaaS};



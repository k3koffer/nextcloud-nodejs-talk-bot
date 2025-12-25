let config = require('../config/database');

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database_name,
    port: config.database_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
  },
  
  pool: { min: 0, max: 7 }
});

module.exports = knex;
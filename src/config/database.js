const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let config = {
    'host': process.env.DB_HOST,
    'user': process.env.DB_USER,
    'password': process.env.DB_PASS,
    'database_name': process.env.DB_NAME,
    'database_port': process.env.DB_PORT
};

module.exports = { config };


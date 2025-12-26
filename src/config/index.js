const path = require('path');
let tools = require('../utils/functions'); 
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let config = {
    'server': process.env.NC_SERVER,
    'botUsername': process.env.NC_USER,
    'appPassword': process.env.NC_PASS,
    'authString': tools.generateAuth(process.env.NC_USER, process.env.NC_PASS),
    'commandPrefix': process.env.BOT_PREFIX || '!',
    'debugMode': process.env.DEBUG === '1'
};

module.exports = { ...config };


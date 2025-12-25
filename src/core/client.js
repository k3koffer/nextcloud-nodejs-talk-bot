let config = require('../config/index.js');
let axios = require('axios');

const USER = config.botUsername
const PASS = config.appPassword;
const AUTH_STRING = Buffer.from(`${USER}:${PASS}`).toString('base64');

const client = axios.create({
    baseURL: config.server, 
    headers: {
        'Authorization': `Basic ${AUTH_STRING}`,
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 10000 
});

module.exports = client;
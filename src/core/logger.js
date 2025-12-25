require('dotenv').config();
let fs = require('fs');

let DEBUG = process.env.DEBUG === '1';

let logger = {
    log: (...args) => {
        if (DEBUG) {
            console.log('ℹ️ [INFO]:', ...args);
        };
    },

    error: (...args) => {
        if (DEBUG) {
            console.error('🔥 [ERROR]:', ...args);
        };
    },

    debug: (...args) => {
        if (DEBUG) {
            console.debug('🐛 [DEBUG]:', ...args);
        };
    }
};

module.exports = logger;
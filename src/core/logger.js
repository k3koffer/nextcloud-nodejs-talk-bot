const config = require('../config/index');
let DEBUG = Boolean(Number(config.debugMode));

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
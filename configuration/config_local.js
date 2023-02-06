const config = require('./config_common.js');

config.SERVER_PORT = 3300;

config.CORS_WHITE_LIST = ['http://localhost:3000', 'http://localhost:22099'];

config.LOG = {
    PATH: 'D:/logs/xraiot/api',
    QUERY: true,
    QUERY_OVER_TIME: 3000,
}

module.exports = config;
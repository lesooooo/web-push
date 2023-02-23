const config = require('./config_common.js');

config.SERVER_PORT = 3300;

config.CORS_WHITE_LIST = ['http://localhost:3000', 'http://localhost:22099'];

config.SSL = {};
config.SSL.PFX = '/home/tnm/ssl_cert/tnmiot_co_kr/_wildcard_tnmiot_co_kr.pfx';
config.SSL.PASSWORD = '83707';

config.LOG = {
    PATH: '/home/tnm/logs/xraiot',
    QUERY: true,
    QUERY_OVER_TIME: 3000,
}

module.exports = config;
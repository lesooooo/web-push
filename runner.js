const https = require('https');
const fs = require('fs');

function serverStartLog() {
    const banner = fs.readFileSync('./framework/banner.txt');
    logger.info(banner.toString());
    logger.info('[' + SERVER_CONFIG.PROJECT_NAME + ' started]: ' + SERVER_CONFIG.SERVER_PORT + ' [ENV] ' + SERVER_CONFIG.RUNNING_ENV);
    logger.error('Log level: error');
    logger.warn('Log level: warn');
    logger.info('Log level: info');
    logger.debug('Log level: debug');
}

module.exports = (app) => {
    switch (SERVER_CONFIG.RUNNING_ENV) {
        case 'local':
        case 'dev':
            app.listen(SERVER_CONFIG.SERVER_PORT, () => serverStartLog());
            break;
        case 'real':
            const options = {
                pfx: fs.readFileSync(SERVER_CONFIG.SSL.PFX),
                passphrase: SERVER_CONFIG.SSL.PASSWORD,
            };
            https.createServer(options, app).listen(SERVER_CONFIG.SERVER_PORT, '0.0.0.0', () => serverStartLog());
            break;
        default:
            console.log('Server did not started properly. Check options', SERVER_CONFIG.RUNNING_ENV);
            logger.error('Server did not started properly. Check options');
    }
};

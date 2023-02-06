require('dotenv').config();
const fs = require('fs');

// 실행 환경: local, dev, real
let env = process.env.RUNNING_ENV;
let fileName;
if (env == 'local') {
    fileName = 'config_local.js';
} else if (env == 'dev') {
    fileName = 'config_dev.js';
} else if (env == 'real') {
    fileName = 'config_real.js';
} else {
    fileName = 'config_local.js';
}
global.SERVER_CONFIG = require('./' + fileName);

// 서버 재시작 없이 환경 설정 변경
fs.watchFile(require.resolve('./' + fileName), () => {
    let prev = JSON.stringify(global.SERVER_CONFIG);
    delete require.cache[require.resolve('./' + fileName)];
    global.SERVER_CONFIG = require('./' + fileName);
    let after = JSON.stringify(global.SERVER_CONFIG);
    logger.info('[Server configuration is changed]\n' + prev + '\n' + '==>  ' + after);
});

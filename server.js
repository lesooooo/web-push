require('./configuration/config.js');// config 글로벌 변수로 등록: SERVER_CONFIG.xxx로 사용
require('./framework/logger.js');// logger 글로벌 변수로 등록: logger.xxx()로 사용
require('./framework/response.js');// response 글로벌 변수로 등록: response.xxx()로 사용
require('./framework/tnmError.js');// error 글로벌 변수로 등록: throw tnmError(code, message)로 사용
require('./utils/common.js');// utils 글로벌 변수로 등록: utils.xxx()로 사용
// require('./framework/dbConnector.js');
require('./framework/asyncWrapper.js');// asyncWrapper 글로벌 변수로 등록: asyncWrapper.xxx()로 사용
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const interceptor = require('./framework/interceptor.js');
const router = require('./router/router.js');
const runner = require('./runner.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// parse JSON body and query string parameters
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}))

let whitelist = SERVER_CONFIG.CORS_WHITE_LIST;
let corsOptions = {
    origin: function(origin, callback) {
        let isWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
app.use(cors(corsOptions));

interceptor(app);
router(app, express);
runner(app);
const fs = require('fs');
const mysql = require('mysql2/promise');
const mybatisMapper = require('mybatis-mapper');

let mapperFiles = [];
fs.readdirSync(__dirname + '/../mapper/').forEach((item, index) => {
    mapperFiles.push(__dirname + '/../mapper/' + item);
});
mybatisMapper.createMapper(mapperFiles);

global.dbConnector = mysql.createPool({
    host: SERVER_CONFIG.DB.HOST,
    port: SERVER_CONFIG.DB.PORT,
    user: SERVER_CONFIG.DB.USER_NAME,
    password: SERVER_CONFIG.DB.PASSWORD,
    database: SERVER_CONFIG.DB.SCHEMA,
    connectionLimit: SERVER_CONFIG.DB.CONNECTION_LIMIT,
    dateStrings: 'date'
});
const fs = require('fs');
const express = require('express');
const router = express.Router();

let apiFiles = [];
fs.readdirSync(__dirname + '/../controller/').forEach((item, index) => apiFiles.push(require('../controller/' + item)));

for(let i=0; i<apiFiles.length; i++) {
    apiFiles[i](router);// routing 연결
}

module.exports = router;
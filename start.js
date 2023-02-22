
const express = require('express');//express모듈 사용
const app = express();//서버 생성
const port = 3000;//포트번호

app.listen(port, ()=>{
    console.log(`sever starting...http://localhost:${port}`);
})
sw(app);
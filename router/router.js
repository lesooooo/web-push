const apiRouter = require('./apiRouter.js');

module.exports = (app, express) => {
    app.use('/', apiRouter);// api page 기본 경로

    // 404 페이지 처리
    app.use((req, res, next) => {
        throw response.fail(404, '존재하지 않는 API 입니다: [' + req.method + '] ' + req.url);
    });

    // exception 처리
    app.use((err, req, res, next) => {
        if(err.responseType && err.responseType == 'custom') {
            logger.error(JSON.stringify(err));
            res.status(err.code).json(err);
        } else {
            logger.error(String(err));
            res.status(500).json(response.fail(500, '서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.'));
        }
    })
}
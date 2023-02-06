const security = require('../utils/security.js');

let skipUrls = [
    '/api/user/login/**',
    '/api/token/refresh',
    '/js/**',
    '/images/**',
    '/css/**',
    '/font/**',
    '/favicon.ico',
    '/api/cheat/**'
];

function IsSkipUrl(pureUrl) {
    let isSkipUrl = false;
    for(let i=0; i<skipUrls.length; i++) {
        let url = skipUrls[i];
        let str = !url.endsWith('**') ? url + '$' : url.replace('**', '\\w+');
        let reg = new RegExp('^' + str);
        if(reg.test(pureUrl)) {
            isSkipUrl = true;
            break;
        }
    }
    return isSkipUrl;
}

module.exports = (app) => {
    app.use(async (req, res, next) => {
        let pureUrl = req.url.indexOf('?') > -1 ? req.url.split('?')[0] : req.url;

        // Authorization skip 여부 검사
        if(!IsSkipUrl(pureUrl)) {
            // JWT Authorization check
            let authorization = req.get('Authorization') || req.query.Authorization;
            authorization = authorization ? authorization.replace('Bearer ', '') : authorization;
            logger.info('Check authorization for [ ' + pureUrl + ' ] \n    [Token] ' + authorization);

            if(!authorization) {
                next(response.fail(401, '로그인이 필요합니다.'));
                return false;
            }

            try {
                // jwt 인증 정보를 body에 담음
                req.body.jwt = security.verifyToken(authorization);
            } catch(e) {
                next(response.fail(401, '유효하지 않은 토큰입니다.'));
                return false;
            }
        }

        next();
    })
}
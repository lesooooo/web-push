const security = require('../utils/security.js');

module.exports = {

    login: function (param) {
        return asyncWrapper.service(async (db) => {
            let returnObj = {};

            let userInfo = {
                userId : "idid", 
                userName : "name"
            };
            
            let jwtPayload = security.createJwtInfo(userInfo);//payload 내용 작성
            let jwt = security.createJwtTokenSet(jwtPayload);//토큰 2개 
            returnObj.accessToken = jwt.accessToken;
            returnObj.refreshToken = jwt.refreshToken;

            param.accessToken = jwt.accessToken;
            param.refreshToken = jwt.refreshToken;
            
            return returnObj;//그룹리스트, 사이트, 토큰셋
        });
    },

    refreshToken: function (param) {
        return asyncWrapper.service(async (db) => {
            let returnObj = {};

            // let refreshToken = param.refreshToken.split('Basic ')[1];
            // let tokenInfo;
            let userInfo = {
                userId : "idid", 
                userName : "name"
            };

            //let jwtPayload = security.createJwtInfo(tokenInfo);//jwt에서 userinfo 가져오기
            let jwt = security.createJwtTokenSet(userInfo);//새로 jwt 발급해서넣기
            returnObj.accessToken = jwt.accessToken;
            returnObj.refreshToken = jwt.refreshToken;

            param.accessToken = jwt.accessToken;
            param.refreshToken = jwt.refreshToken;
            
            return returnObj;//newTokenSet
        });
    },

};

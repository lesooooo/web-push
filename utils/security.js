const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

function CreateJwtToken(payload, options) {
    try {
        return jwt.sign(payload, SERVER_CONFIG.SECURITY.JWT_KEY, options);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    encryptPassword: (data) => {
        if (!data) throw response.fail(400, 'Password can not be empty.');

        try {
            return crypto.SHA256(data + SERVER_CONFIG.SECURITY.USER_PASS_KEY).toString();
        } catch (e) {
            console.log(e);
            throw e;
        }
    },

    createJwtInfo: (userInfo) => {
        let obj = {
            userId: userInfo.userId,
            userName: userInfo.userName,
        };
        return obj;
    },

    createJwtTokenSet: (payload) => {
        let options = {
            expiresIn: '30d',
            issuer: 'tnmtech.com',
            subject: 'userInfo',
        };
        let accessToken = CreateJwtToken(payload, options);

        options.expiresIn = '7d';
        let refreshToken = CreateJwtToken(payload, options);

        return { accessToken: accessToken, refreshToken: refreshToken };
    },

    verifyToken: (token) => {
        return jwt.verify(token, SERVER_CONFIG.SECURITY.JWT_KEY);
    },

    decodeToken: (token) => {
        return jwt.decode(token, { complete: true });
    },
};

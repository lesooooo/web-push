require('dotenv').config();

module.exports = {
    PROJECT_NAME: 'XRAIOT',
    RUNNING_ENV: process.env.RUNNING_ENV,
    SECURITY: {
        JWT_KEY: process.env.JWT_KEY,
        USER_PASS_KEY: process.env.USER_PASS_KEY,
    },
    // DB: {
    //     HOST: process.env.DB_HOST,
    //     PORT: process.env.DB_PORT,
    //     USER_NAME: process.env.DB_USER_NAME,
    //     PASSWORD: process.env.DB_PASSWORD,
    //     CONNECTION_LIMIT: 50,
    //     SCHEMA: process.env.DB_SCHEMA,
    // },
};

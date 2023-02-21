const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const logDir = SERVER_CONFIG.LOG.PATH;  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(info => {
  return `[${info.timestamp}] [${info.level}] ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    level: 'info',
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `${SERVER_CONFIG.PROJECT_NAME}_API_%DATE%.log`,
            maxFiles: 30,  // 30일치 로그 파일 저장
            zippedArchive: true,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',  // error.log 파일은 따로 저장
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

// local 인 경우 console 에도 로그를 찍도록 설정
if(SERVER_CONFIG.RUNNING_ENV == 'local') {
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),  // 색깔 넣어서 출력
            logFormat
        )
    }));
}

// 서버 구동 시 global 변수로 세팅
global.logger = logger;
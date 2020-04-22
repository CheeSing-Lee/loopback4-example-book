import {RequestContext} from '@loopback/rest';
import {HttpError} from 'http-errors';
import {ServerConfig} from '../server-config';

require('winston-daily-rotate-file');
// eslint-disable-next-line no-unused-expressions
require('./rsys-logger').Rsyslog;
const winston = require('winston');

const MAX_FILE_SIZE = '10m'; // 10 MB
const MAX_NO_FILES = '10'; // number of files per day
const DATE_STR_PATTERN = 'YYYY-MM-DD';
const LOG_DIRECTORY = ServerConfig.getInstance().getEnvVariable('LOG_PATH');

const dailyRotateFile = new winston.transports.DailyRotateFile({
  filename: 'node-application-%DATE%.log',
  dirname: LOG_DIRECTORY,
  datePattern: DATE_STR_PATTERN,
  zippedArchive: false,
  maxSize: MAX_FILE_SIZE,
  maxFiles: MAX_NO_FILES,
});

const exceptionsRotateFile = new winston.transports.DailyRotateFile({
  filename: 'node-exceptions-%DATE%.log',
  dirname: LOG_DIRECTORY,
  datePattern: DATE_STR_PATTERN,
  zippedArchive: false,
  maxSize: MAX_FILE_SIZE,
  maxFiles: MAX_NO_FILES,
});

const rsysLogFile = new winston.transports.Rsyslog({
  host: 'localhost',
  port: 514,
  facility: 16,
  protocol: 'T',
  messageProvider: 'msg',
  tag: 'nodejs_app',
});

export class AppLogger {
  private logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: 'notice',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    exitOnError: false,
    transports: [dailyRotateFile, rsysLogFile],
    exceptionHandlers: [exceptionsRotateFile],
  });

  private static instance: AppLogger;

  private constructor() {}

  public static getInstance(): AppLogger {
    return !AppLogger.instance ? new AppLogger() : AppLogger.instance;
  }

  public logRequestError(err: HttpError, context: RequestContext) {
    if (err) {
      const {request} = context;
      this.logger.notice({
        datetime: new Date(),
        statusCode: err.status,
        details: err.stack,
        url: request.originalUrl,
        method: request.method,
        ip: request.ip,
      });
    }
  }

  public logError(err: HttpError) {
    if (err) {
      this.logger.notice({
        datetime: new Date(),
        statusCode: err.status,
        details: err.stack,
      });
    }
  }
}

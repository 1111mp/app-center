import { format, transports } from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  type WinstonModuleOptions,
} from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';

function jsonStringify(data: any) {
  if (typeof data === 'string') {
    return data;
  }

  return JSON.stringify(data, null, '  ');
}

function formatter(showStack: boolean = false) {
  return {
    transform: (info) => {
      const { context, message, timestamp } = info;

      const level = info[Symbol.for('level')];
      const args = info[Symbol.for('splat')] || [];

      let strArgs = args.map(jsonStringify).join(' ');
      strArgs.length && (strArgs = ` ${strArgs}`);

      let stack = '';
      if (showStack) {
        stack = info.stack ? `\n\t${jsonStringify(info.stack).replace(/\n/g, '\n\t')}` : '';
      }

      info[Symbol.for('message')] =
        `[${timestamp}] [${level}] [${context}]: ${jsonStringify(message)}${strArgs}${stack}`;

      return info;
    },
  };
}

export const getLoggerOptions = (): WinstonModuleOptions => ({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS Z' }),
    formatter(true),
  ),
  transports:
    process.env.NODE_ENV === 'development'
      ? [
          new transports.Console({
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS Z' }),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
        ]
      : [
          new DailyRotateFile({
            level: process.env.LOG_LEVEL || 'info',
            dirname: process.env.LOG_DIR || './logs',
            filename: 'access-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '7d',
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS Z' }),
              formatter(false),
            ),
          }),
          new DailyRotateFile({
            level: 'error',
            dirname: process.env.LOG_DIR || './logs',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          }),
        ],
});

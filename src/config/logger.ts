import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log format
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} | [${level.toUpperCase()}] | ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    logFormat
  ),
  transports: [
    // new transports.Console(), // Log to the console
    new DailyRotateFile({
      filename: path.join('logs', 'api-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '200m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  ],
});

export default logger;
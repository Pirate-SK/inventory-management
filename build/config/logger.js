"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
// Define log format
const logFormat = winston_1.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} | [${level.toUpperCase()}] | ${message}`;
});
// Create a Winston logger
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }), logFormat),
    transports: [
        // new transports.Console(), // Log to the console
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join('logs', 'api-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '200m',
            maxFiles: '30d',
            zippedArchive: true,
        }),
    ],
});
exports.default = logger;

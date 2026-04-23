import Winston from 'winston';

const logger = Winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: Winston.format.combine(
    Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    Winston.format.colorize(),
    Winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new Winston.transports.Console(),
    new Winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new Winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;

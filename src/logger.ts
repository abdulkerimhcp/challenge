import {createLogger, format, transports} from 'winston';

// Create Winston Logger
export const logger = createLogger({
  level: 'info', // Set the logging level (e.g., 'info', 'debug', 'error')
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({filename: 'app.log'}), // Log to a file
  ],
});

// Example of how to log messages
logger.info('Winston logger initialized');
logger.error('This is an error message');

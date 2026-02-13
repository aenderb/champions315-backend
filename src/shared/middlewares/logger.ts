import expressWinston from 'express-winston';
import winston from 'winston';

// Middleware para logar requisições HTTP
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ 
      filename: 'logs/request.log',
      level: 'http',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: (req) => {
    // Ignorar rotas de health check
    return req.url === '/health';
  },
});

// Middleware para logar erros
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});

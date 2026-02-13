import winston from 'winston';

// Configuração agnóstica de transports
// Facilita a troca para Elasticsearch, CloudWatch, etc no futuro
const transports: winston.transport[] = [
  // Console em desenvolvimento
  ...(process.env.NODE_ENV === 'dev'
    ? [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ]
    : []),

  // Arquivo para requisições
  new winston.transports.File({
    filename: 'logs/request.log',
    level: 'http',
  }),

  // Arquivo para erros
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),

  // Arquivo combinado (todos os logs)
  new winston.transports.File({
    filename: 'logs/combined.log',
  }),
];

// Logger base configurável
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'champions315api' },
  transports,
});

// Para facilitar migração futura para Elasticsearch:
// 1. Criar novo transport: new winston.transports.Elasticsearch({...})
// 2. Adicionar no array 'transports' acima
// 3. Remover transports de arquivo se necessário

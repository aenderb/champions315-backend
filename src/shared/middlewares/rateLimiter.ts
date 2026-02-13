import rateLimit from 'express-rate-limit';
import { env } from '@/env';

const isDevelopment = env.NODE_ENV === 'dev';

// Rate limiter geral para todas as rotas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDevelopment ? 1000 : 100, // Dev: 1000 req | Prod: 100 req
  message: {
    status: 'error',
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
  standardHeaders: true, // Retorna info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
});

// Rate limiter rigoroso para autenticação (evita força bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDevelopment ? 100 : 5, // Dev: 100 tentativas | Prod: 5 tentativas
  message: {
    status: 'error',
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Conta mesmo requests bem-sucedidos
});

// Rate limiter para criação de conta (evita spam)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDevelopment ? 100 : 3, // Dev: 100 contas | Prod: 3 contas
  message: {
    status: 'error',
    message: 'Muitas contas criadas. Tente novamente em 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

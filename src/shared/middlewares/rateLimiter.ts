import rateLimit from 'express-rate-limit';
import { env } from '@/env';

// Rate limiter geral para todas as rotas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.RATE_LIMIT_GENERAL_MAX,
  message: {
    status: 'error',
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter rigoroso para autenticação (evita força bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.RATE_LIMIT_AUTH_MAX,
  message: {
    status: 'error',
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Rate limiter para criação de conta (evita spam)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: env.RATE_LIMIT_SIGNUP_MAX,
  message: {
    status: 'error',
    message: 'Muitas contas criadas. Tente novamente em 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

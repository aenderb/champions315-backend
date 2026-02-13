import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../utils/httpStatus';

 
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Erro capturado:', err);

  // Erros customizados com statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Erros de validação Zod
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation error',
      errors: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Erro genérico 500
  console.error('Stack trace:', err.stack);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'dev' && { 
      error: err.message, 
      stack: err.stack 
    }),
  });
};

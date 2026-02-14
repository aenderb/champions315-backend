import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { Prisma } from '../../../generated/prisma';
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

  // Erros do Multer (upload de arquivos)
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: 'Arquivo muito grande. Máximo permitido: 5MB.',
      LIMIT_FILE_COUNT: 'Número máximo de arquivos excedido.',
      LIMIT_UNEXPECTED_FILE: 'Campo de arquivo inesperado.',
    };
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: messages[err.code] ?? `Erro no upload: ${err.message}`,
    });
  }

  // Erro de tipo de arquivo (fileFilter do multer)
  if (err.message?.includes('Tipo de arquivo inválido')) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
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

  // Erros do Prisma — violação de integridade referencial (Restrict/foreign key)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2003') {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'Não é possível realizar esta operação. Existem registros dependentes que devem ser removidos primeiro.',
      });
    }

    if (err.code === 'P2025') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Registro não encontrado.',
      });
    }
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

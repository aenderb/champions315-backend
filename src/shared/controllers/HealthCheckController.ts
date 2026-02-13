import { Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/utils/httpStatus';
import { prisma } from '@/shared/infra/prisma/client';

export class HealthCheckController {
  async handle(_req: Request, res: Response): Promise<Response> {
    try {
      // Verifica conexão com o banco
      await prisma.$queryRaw`SELECT 1`;

      return res.status(HTTP_STATUS.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      });
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

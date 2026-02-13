import { Request, Response, NextFunction } from "express";
import { PrismaRefreshTokenRepository } from "../repository/PrismaRefreshTokenRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class LogoutController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Revoga todos os refresh tokens do usuário no banco
      if (req.userId) {
        const refreshTokenRepository = new PrismaRefreshTokenRepository();
        await refreshTokenRepository.revokeByUserId(req.userId);
      }

      // Limpa ambos os cookies
      res.clearCookie("token", {
        httpOnly: true,
        path: "/",
      });

      res.clearCookie("refresh_token", {
        httpOnly: true,
        path: "/",
      });

      return res.status(HTTP_STATUS.OK).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { PrismaRefreshTokenRepository } from "../repository/PrismaRefreshTokenRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";
import { env } from "@/env";

export class LogoutController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Revoga todos os refresh tokens do usuário no banco
      if (req.userId) {
        const refreshTokenRepository = new PrismaRefreshTokenRepository();
        await refreshTokenRepository.revokeByUserId(req.userId);
      }

      const cookieOptions = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" as const : "lax" as const,
        path: "/",
      };

      // Limpa ambos os cookies com mesmas flags de criação
      res.clearCookie("token", cookieOptions);
      res.clearCookie("refresh_token", cookieOptions);

      return res.status(HTTP_STATUS.OK).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

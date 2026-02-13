import { Request, Response, NextFunction } from "express";
import { RefreshTokenService } from "../service/RefreshTokenService";
import { PrismaRefreshTokenRepository } from "../repository/PrismaRefreshTokenRepository";
import { PrismaUserRepository } from "../repository/PrismaUserRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";
import { env } from "@/env";

export class RefreshTokenController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const rawRefreshToken = req.cookies?.refresh_token;

      const refreshTokenRepository = new PrismaRefreshTokenRepository();
      const userRepository = new PrismaUserRepository();
      const refreshTokenService = new RefreshTokenService(refreshTokenRepository, userRepository);

      const { user, accessToken } = await refreshTokenService.execute(rawRefreshToken);

      // Setar novo access token no cookie
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: "/",
      });

      return res.status(HTTP_STATUS.OK).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

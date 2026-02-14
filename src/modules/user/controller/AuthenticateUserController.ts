import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthenticateUserService } from "../service/AuthenticateUserService";
import { PrismaUserRepository } from "../repository/PrismaUserRepository";
import { PrismaRefreshTokenRepository } from "../repository/PrismaRefreshTokenRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";
import { env } from "@/env";

export class AuthenticateUserController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { email, password } = authenticateBodySchema.parse(req.body);

      const userRepository = new PrismaUserRepository();
      const refreshTokenRepository = new PrismaRefreshTokenRepository();
      const authenticateUserService = new AuthenticateUserService(userRepository, refreshTokenRepository);

      const { user, accessToken, refreshToken, refreshExpiresMs } = await authenticateUserService.execute({ email, password });

      // Cookie do access token (curta duração - 15 min)
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: "/",
      });

      // Cookie do refresh token (longa duração - 7 dias)
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: refreshExpiresMs,
        path: "/",
      });

      return res.status(HTTP_STATUS.OK).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
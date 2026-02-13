import { compare } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repository/IUserRepository";
import { IRefreshTokenRepository } from "../repository/IRefreshTokenRepository";
import { IAuthenticateUserDTO } from "../dto/AuthenticateUserDTO";
import { UnauthorizedError } from "@/shared/errors";
import { env } from "@/env";

export class AuthenticateUserService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Access token (curta duração)
    const accessToken = jwt.sign(
      { sub: user.id }, 
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRATION_TIME } as jwt.SignOptions
    );

    // Refresh token (longa duração) — token opaco armazenado como hash no DB
    const rawRefreshToken = randomBytes(64).toString("hex");
    const refreshTokenHash = createHash("sha256").update(rawRefreshToken).digest("hex");

    // Calcula expiração do refresh token
    const refreshExpiresMs = this.parseExpiration(env.JWT_REFRESH_EXPIRATION_TIME);
    const expiresAt = new Date(Date.now() + refreshExpiresMs);

    // Revoga todos os refresh tokens anteriores do usuário
    await this.refreshTokenRepository.revokeByUserId(user.id);

    // Salva o novo refresh token no banco
    await this.refreshTokenRepository.create({
      token_hash: refreshTokenHash,
      user_id: user.id,
      expires_at: expiresAt,
    });

    // Remove password_hash do retorno
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;
    
    return { 
      user: userWithoutPassword, 
      accessToken, 
      refreshToken: rawRefreshToken,
      refreshExpiresMs,
    };
  }

  private parseExpiration(exp: string): number {
    const match = exp.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback 7d

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case "s": return value * 1000;
      case "m": return value * 60 * 1000;
      case "h": return value * 60 * 60 * 1000;
      case "d": return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
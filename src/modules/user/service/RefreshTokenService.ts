import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { IRefreshTokenRepository } from "../repository/IRefreshTokenRepository";
import { IUserRepository } from "../repository/IUserRepository";
import { UnauthorizedError } from "@/shared/errors";
import { env } from "@/env";

export class RefreshTokenService {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedError("Refresh token não fornecido");
    }

    // Gera o hash do token recebido para buscar no banco
    const tokenHash = createHash("sha256").update(rawRefreshToken).digest("hex");

    // Busca refresh token válido (não revogado e não expirado)
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError("Refresh token inválido ou expirado");
    }

    // Verifica se o usuário ainda existe
    const user = await this.userRepository.findById(storedToken.user_id);

    if (!user) {
      // Revoga o token se o usuário não existe mais
      await this.refreshTokenRepository.revokeToken(storedToken.id);
      throw new UnauthorizedError("Usuário não encontrado");
    }

    // Gera novo access token
    const accessToken = jwt.sign(
      { sub: user.id },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRATION_TIME } as jwt.SignOptions,
    );

    return { user, accessToken };
  }
}

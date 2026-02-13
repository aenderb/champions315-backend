import { RefreshToken } from "../../../generated/prisma";
import { prisma } from "@/shared/infra/prisma/client";
import { ICreateRefreshTokenDTO, IRefreshTokenRepository } from "./IRefreshTokenRepository";

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: ICreateRefreshTokenDTO): Promise<RefreshToken> {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        token_hash: data.token_hash,
        user_id: data.user_id,
        expires_at: data.expires_at,
      },
    });

    return refreshToken;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token_hash: tokenHash,
        revoked_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    return refreshToken;
  }

  async revokeByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        user_id: userId,
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  }

  async revokeToken(id: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: { revoked_at: new Date() },
    });
  }

  async deleteExpired(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
  }
}

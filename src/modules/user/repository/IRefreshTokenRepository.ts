import { RefreshToken } from "../../../../generated/prisma";

export interface ICreateRefreshTokenDTO {
  token_hash: string;
  user_id: string;
  expires_at: Date;
}

export interface IRefreshTokenRepository {
  create(data: ICreateRefreshTokenDTO): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeByUserId(userId: string): Promise<void>;
  revokeToken(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

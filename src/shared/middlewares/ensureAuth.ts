import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { UnauthorizedError } from "@/shared/errors";

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function ensureAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    throw new UnauthorizedError("Token não fornecido");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as TokenPayload;

    // Disponibiliza o userId para os controllers via req
    req.userId = decoded.sub;

    next();
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}

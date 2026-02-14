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
  // 1. Tenta ler do cookie
  let token = req.cookies?.token;

  // 2. Fallback: header Authorization Bearer
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (env.NODE_ENV === "production") {
    console.log("[ensureAuth] cookies recebidos:", Object.keys(req.cookies ?? {}));
    console.log("[ensureAuth] origin:", req.headers.origin);
    console.log("[ensureAuth] token presente:", !!token);
  }

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

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

/**
 * Middleware que captura erros do express-validator e retorna 400.
 * Deve ser colocado APÓS os middlewares de validação nas rotas.
 */
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : err.type,
        message: err.msg,
      })),
    });
    return;
  }

  next();
}

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaUserRepository } from "../repository/PrismaUserRepository";
import { GetUserByIdService } from "../service/GetUserByIdService";
import { NotFoundError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetUserByIdController {
  // Implementação do controller para encontrar usuário por ID
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "ID inválido" }),
      });

      const { id } = paramsSchema.parse(req.params);

      // Injeção manual de dependências - a cada requisição
      const userRepository = new PrismaUserRepository();
      const getUserByIdService = new GetUserByIdService(userRepository);

      const user = await getUserByIdService.execute(id);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      return res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      next(error);
    }
  } 
} 
// CreateUserController

import { Request, Response, NextFunction } from "express";
import z from "zod";
import { CreateUserService } from "../service/CreateUserService";
import { PrismaUserRepository } from "../repository/PrismaUserRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";
export class CreateUserController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const registerBodySchema = z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { name, email, password } = registerBodySchema.parse(req.body);

      // Avatar: upload para Cloudinary se enviado
      let avatar: string | undefined;
      if (req.file) {
        const { uploadToCloudinary } = await import("@/shared/config/cloudinary");
        avatar = await uploadToCloudinary(req.file.buffer, "avatars");
      }

      // Injeção manual de dependências - a cada requisição
      const userRepository = new PrismaUserRepository();
      const createUserService = new CreateUserService(userRepository);

      const user = await createUserService.execute({
        name,
        email,
        password,
        avatar,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
      });
    } catch (error) {
      next(error);
    }
  }
}

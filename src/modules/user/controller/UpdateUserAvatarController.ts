import { Request, Response, NextFunction } from "express";
import { UpdateUserAvatarService } from "../service/UpdateUserAvatarService";
import { PrismaUserRepository } from "../repository/PrismaUserRepository";
import { uploadToCloudinary } from "@/shared/config/cloudinary";
import { BadRequestError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class UpdateUserAvatarController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.userId!;

      if (!req.file) {
        throw new BadRequestError("Nenhuma imagem enviada");
      }

      const avatarUrl = await uploadToCloudinary(req.file.buffer, "avatars");

      const userRepository = new PrismaUserRepository();
      const updateUserAvatarService = new UpdateUserAvatarService(userRepository);

      const user = await updateUserAvatarService.execute(userId, avatarUrl);

      return res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
}

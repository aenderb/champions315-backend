import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetPlayerByIdService } from "../service/GetPlayerByIdService";
import { PrismaPlayerRepository } from "../repository/PrismaPlayerRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetPlayerByIdController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);

      const playerRepository = new PrismaPlayerRepository();
      const getPlayerByIdService = new GetPlayerByIdService(playerRepository);

      const player = await getPlayerByIdService.execute(id);

      return res.status(HTTP_STATUS.OK).json(player);
    } catch (error) {
      next(error);
    }
  }
}

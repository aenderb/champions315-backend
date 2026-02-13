import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DeletePlayerService } from "../service/DeletePlayerService";
import { PrismaPlayerRepository } from "../repository/PrismaPlayerRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class DeletePlayerController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);
      const userId = req.userId!;

      const playerRepository = new PrismaPlayerRepository();
      const teamRepository = new PrismaTeamRepository();
      const deletePlayerService = new DeletePlayerService(playerRepository, teamRepository);

      await deletePlayerService.execute(id, userId);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

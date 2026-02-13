import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DeleteMatchService } from "../service/DeleteMatchService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class DeleteMatchController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);
      const userId = req.userId!;

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const deleteMatchService = new DeleteMatchService(matchRepository, teamRepository);

      await deleteMatchService.execute(id, userId);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

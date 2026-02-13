import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DeleteLineupService } from "../service/DeleteLineupService";
import { PrismaLineupRepository } from "../repository/PrismaLineupRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class DeleteLineupController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);
      const userId = req.userId!;

      const lineupRepository = new PrismaLineupRepository();
      const teamRepository = new PrismaTeamRepository();
      const deleteLineupService = new DeleteLineupService(lineupRepository, teamRepository);

      await deleteLineupService.execute(id, userId);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

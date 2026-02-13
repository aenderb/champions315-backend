import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UpdateLineupService } from "../service/UpdateLineupService";
import { PrismaLineupRepository } from "../repository/PrismaLineupRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { PrismaPlayerRepository } from "@/modules/player/repository/PrismaPlayerRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class UpdateLineupController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const updateLineupSchema = z.object({
        name: z.string().min(2).max(100).optional(),
        formation: z.string().min(3).max(20).optional(),
        starter_ids: z.array(z.string().uuid()).length(9, "A escalação deve ter exatamente 9 titulares").optional(),
        bench_ids: z.array(z.string().uuid()).max(30).optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = updateLineupSchema.parse(req.body);
      const userId = req.userId!;

      const lineupRepository = new PrismaLineupRepository();
      const teamRepository = new PrismaTeamRepository();
      const playerRepository = new PrismaPlayerRepository();
      const updateLineupService = new UpdateLineupService(lineupRepository, teamRepository, playerRepository);

      const lineup = await updateLineupService.execute(id, userId, data);

      return res.status(HTTP_STATUS.OK).json(lineup);
    } catch (error) {
      next(error);
    }
  }
}

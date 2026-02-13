import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateLineupService } from "../service/CreateLineupService";
import { PrismaLineupRepository } from "../repository/PrismaLineupRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { PrismaPlayerRepository } from "@/modules/player/repository/PrismaPlayerRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class CreateLineupController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const createLineupSchema = z.object({
        name: z.string().min(2).max(100),
        formation: z.string().min(3).max(20).optional(),
        starter_ids: z.array(z.string().uuid()).length(9, "A escalação deve ter exatamente 9 titulares"),
        bench_ids: z.array(z.string().uuid()).max(30),
      });

      const { teamId } = paramsSchema.parse(req.params);
      const data = createLineupSchema.parse(req.body);
      const userId = req.userId!;

      const lineupRepository = new PrismaLineupRepository();
      const teamRepository = new PrismaTeamRepository();
      const playerRepository = new PrismaPlayerRepository();
      const createLineupService = new CreateLineupService(lineupRepository, teamRepository, playerRepository);

      const lineup = await createLineupService.execute(userId, teamId, data);

      return res.status(HTTP_STATUS.CREATED).json(lineup);
    } catch (error) {
      next(error);
    }
  }
}

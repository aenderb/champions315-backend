import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetLineupsByTeamService } from "../service/GetLineupsByTeamService";
import { PrismaLineupRepository } from "../repository/PrismaLineupRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetLineupsByTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const { teamId } = paramsSchema.parse(req.params);

      const lineupRepository = new PrismaLineupRepository();
      const teamRepository = new PrismaTeamRepository();
      const getLineupsByTeamService = new GetLineupsByTeamService(lineupRepository, teamRepository);

      const lineups = await getLineupsByTeamService.execute(teamId);

      return res.status(HTTP_STATUS.OK).json(lineups);
    } catch (error) {
      next(error);
    }
  }
}

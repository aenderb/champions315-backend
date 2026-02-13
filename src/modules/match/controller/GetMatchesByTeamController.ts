import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetMatchesByTeamService } from "../service/GetMatchesByTeamService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetMatchesByTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const { teamId } = paramsSchema.parse(req.params);

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const getMatchesByTeamService = new GetMatchesByTeamService(matchRepository, teamRepository);

      const matches = await getMatchesByTeamService.execute(teamId);

      return res.status(HTTP_STATUS.OK).json(matches);
    } catch (error) {
      next(error);
    }
  }
}

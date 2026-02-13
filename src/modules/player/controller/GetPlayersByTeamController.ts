import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetPlayersByTeamService } from "../service/GetPlayersByTeamService";
import { PrismaPlayerRepository } from "../repository/PrismaPlayerRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetPlayersByTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const { teamId } = paramsSchema.parse(req.params);

      const playerRepository = new PrismaPlayerRepository();
      const teamRepository = new PrismaTeamRepository();
      const getPlayersByTeamService = new GetPlayersByTeamService(playerRepository, teamRepository);

      const players = await getPlayersByTeamService.execute(teamId);

      return res.status(HTTP_STATUS.OK).json(players);
    } catch (error) {
      next(error);
    }
  }
}

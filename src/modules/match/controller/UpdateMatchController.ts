import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UpdateMatchService } from "../service/UpdateMatchService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class UpdateMatchController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const updateMatchSchema = z.object({
        opponent_name: z.string().min(2).max(100).optional(),
        team_score: z.number().int().min(0).optional(),
        opponent_score: z.number().int().min(0).optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD").refine((d) => !isNaN(new Date(d).getTime()), "Data inválida").optional(),
        notes: z.string().max(500).nullable().optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = updateMatchSchema.parse(req.body);
      const userId = req.userId!;

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const updateMatchService = new UpdateMatchService(matchRepository, teamRepository);

      const match = await updateMatchService.execute(id, userId, data);

      return res.status(HTTP_STATUS.OK).json(match);
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateMatchService } from "../service/CreateMatchService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { PrismaPlayerRepository } from "@/modules/player/repository/PrismaPlayerRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class CreateMatchController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const cardSchema = z.object({
        player_id: z.string().uuid(),
        type: z.enum(["YELLOW", "RED"]),
        minute: z.number().int().min(0).max(120).optional(),
      });

      const createMatchSchema = z.object({
        opponent_name: z.string().min(2).max(100),
        team_score: z.number().int().min(0),
        opponent_score: z.number().int().min(0),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD").refine((d) => !isNaN(new Date(d).getTime()), "Data inválida"),
        notes: z.string().max(500).optional(),
        cards: z.array(cardSchema).optional(),
      });

      const { teamId } = paramsSchema.parse(req.params);
      const data = createMatchSchema.parse(req.body);
      const userId = req.userId!;

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const playerRepository = new PrismaPlayerRepository();
      const createMatchService = new CreateMatchService(matchRepository, teamRepository, playerRepository);

      const match = await createMatchService.execute(userId, teamId, data);

      return res.status(HTTP_STATUS.CREATED).json(match);
    } catch (error) {
      next(error);
    }
  }
}

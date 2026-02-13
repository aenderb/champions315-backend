import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreatePlayerService } from "../service/CreatePlayerService";
import { PrismaPlayerRepository } from "../repository/PrismaPlayerRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class CreatePlayerController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        teamId: z.string().uuid(),
      });

      const createPlayerSchema = z.object({
        number: z.coerce.number().int().min(1).max(99),
        name: z.string().min(2).max(100),
        birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD"),
        avatar: z.string().optional(),
        position: z.enum(["GK", "DEF", "MID", "FWD"]),
      });

      const { teamId } = paramsSchema.parse(req.params);
      const data = createPlayerSchema.parse(req.body);
      const userId = req.userId!;

      const playerRepository = new PrismaPlayerRepository();
      const teamRepository = new PrismaTeamRepository();
      const createPlayerService = new CreatePlayerService(playerRepository, teamRepository);

      const player = await createPlayerService.execute(userId, teamId, data);

      return res.status(HTTP_STATUS.CREATED).json(player);
    } catch (error) {
      next(error);
    }
  }
}

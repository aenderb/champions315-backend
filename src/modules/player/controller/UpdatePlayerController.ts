import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UpdatePlayerService } from "../service/UpdatePlayerService";
import { PrismaPlayerRepository } from "../repository/PrismaPlayerRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class UpdatePlayerController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const updatePlayerSchema = z.object({
        number: z.coerce.number().int().min(1).max(99).optional(),
        name: z.string().min(2).max(100).optional(),
        birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD").optional(),
        avatar: z.string().nullable().optional(),
        position: z.enum(["GK", "DEF", "MID", "FWD"]).optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = updatePlayerSchema.parse(req.body);
      const userId = req.userId!;

      const playerRepository = new PrismaPlayerRepository();
      const teamRepository = new PrismaTeamRepository();
      const updatePlayerService = new UpdatePlayerService(playerRepository, teamRepository);

      const player = await updatePlayerService.execute(id, userId, data);

      return res.status(HTTP_STATUS.OK).json(player);
    } catch (error) {
      next(error);
    }
  }
}

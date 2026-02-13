import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AddCardService } from "../service/AddCardService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { PrismaPlayerRepository } from "@/modules/player/repository/PrismaPlayerRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class AddCardController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(), // match id
      });

      const addCardSchema = z.object({
        player_id: z.string().uuid(),
        type: z.enum(["YELLOW", "RED"]),
        minute: z.number().int().min(0).max(120).optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = addCardSchema.parse(req.body);
      const userId = req.userId!;

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const playerRepository = new PrismaPlayerRepository();
      const addCardService = new AddCardService(matchRepository, teamRepository, playerRepository);

      const card = await addCardService.execute(id, userId, data);

      return res.status(HTTP_STATUS.CREATED).json(card);
    } catch (error) {
      next(error);
    }
  }
}

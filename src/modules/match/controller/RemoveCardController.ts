import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { RemoveCardService } from "../service/RemoveCardService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { PrismaTeamRepository } from "@/modules/team/repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class RemoveCardController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),      // match id
        cardId: z.string().uuid(),   // card id
      });

      const { cardId } = paramsSchema.parse(req.params);
      const userId = req.userId!;

      const matchRepository = new PrismaMatchRepository();
      const teamRepository = new PrismaTeamRepository();
      const removeCardService = new RemoveCardService(matchRepository, teamRepository);

      await removeCardService.execute(cardId, userId);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { DeleteTeamService } from "../service/DeleteTeamService";
import { PrismaTeamRepository } from "../repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class DeleteTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);
      const userId = req.userId!;

      const teamRepository = new PrismaTeamRepository();
      const deleteTeamService = new DeleteTeamService(teamRepository);

      await deleteTeamService.execute(id, userId);

      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UpdateTeamService } from "../service/UpdateTeamService";
import { PrismaTeamRepository } from "../repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class UpdateTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const updateTeamSchema = z.object({
        name: z.string().min(2).max(100).optional(),
        color: z.string().min(3).max(20).optional(),
        badge: z.string().nullable().optional(),
        year: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
        sponsor: z.string().max(100).nullable().optional(),
        sponsor_logo: z.string().nullable().optional(),
      });

      const { id } = paramsSchema.parse(req.params);
      const data = updateTeamSchema.parse(req.body);
      const userId = req.userId!;

      const teamRepository = new PrismaTeamRepository();
      const updateTeamService = new UpdateTeamService(teamRepository);

      const team = await updateTeamService.execute(id, userId, data);

      return res.status(HTTP_STATUS.OK).json(team);
    } catch (error) {
      next(error);
    }
  }
}

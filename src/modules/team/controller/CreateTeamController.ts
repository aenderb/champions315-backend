import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateTeamService } from "../service/CreateTeamService";
import { PrismaTeamRepository } from "../repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class CreateTeamController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const createTeamSchema = z.object({
        name: z.string().min(2).max(100),
        color: z.string().min(3).max(20),
        badge: z.string().optional(),
        year: z.coerce.number().int().min(1900).max(2100).optional(),
        sponsor: z.string().max(100).optional(),
        sponsor_logo: z.string().optional(),
      });

      const data = createTeamSchema.parse(req.body);
      const userId = req.userId!;

      const teamRepository = new PrismaTeamRepository();
      const createTeamService = new CreateTeamService(teamRepository);

      const team = await createTeamService.execute(userId, data);

      return res.status(HTTP_STATUS.CREATED).json(team);
    } catch (error) {
      next(error);
    }
  }
}

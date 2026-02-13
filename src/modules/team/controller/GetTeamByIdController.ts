import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetTeamByIdService } from "../service/GetTeamByIdService";
import { PrismaTeamRepository } from "../repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetTeamByIdController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);

      const teamRepository = new PrismaTeamRepository();
      const getTeamByIdService = new GetTeamByIdService(teamRepository);

      const team = await getTeamByIdService.execute(id);

      return res.status(HTTP_STATUS.OK).json(team);
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { GetTeamsByUserService } from "../service/GetTeamsByUserService";
import { PrismaTeamRepository } from "../repository/PrismaTeamRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetTeamsByUserController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.userId!;

      const teamRepository = new PrismaTeamRepository();
      const getTeamsByUserService = new GetTeamsByUserService(teamRepository);

      const teams = await getTeamsByUserService.execute(userId);

      return res.status(HTTP_STATUS.OK).json(teams);
    } catch (error) {
      next(error);
    }
  }
}

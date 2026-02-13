import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetMatchByIdService } from "../service/GetMatchByIdService";
import { PrismaMatchRepository } from "../repository/PrismaMatchRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetMatchByIdController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);

      const matchRepository = new PrismaMatchRepository();
      const getMatchByIdService = new GetMatchByIdService(matchRepository);

      const match = await getMatchByIdService.execute(id);

      return res.status(HTTP_STATUS.OK).json(match);
    } catch (error) {
      next(error);
    }
  }
}

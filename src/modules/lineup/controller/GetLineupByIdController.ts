import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { GetLineupByIdService } from "../service/GetLineupByIdService";
import { PrismaLineupRepository } from "../repository/PrismaLineupRepository";
import { HTTP_STATUS } from "@/shared/utils/httpStatus";

export class GetLineupByIdController {
  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(req.params);

      const lineupRepository = new PrismaLineupRepository();
      const getLineupByIdService = new GetLineupByIdService(lineupRepository);

      const lineup = await getLineupByIdService.execute(id);

      return res.status(HTTP_STATUS.OK).json(lineup);
    } catch (error) {
      next(error);
    }
  }
}

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
        year: z.coerce.number().int().min(1900).max(2100).optional(),
        sponsor: z.string().max(100).optional(),
      });

      const data = createTeamSchema.parse(req.body);
      const userId = req.userId!;

      // Upload de imagens para Cloudinary
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      let badge: string | undefined;
      let sponsor_logo: string | undefined;

      if (files) {
        const { uploadToCloudinary } = await import("@/shared/config/cloudinary");

        if (files.badge?.[0]) {
          badge = await uploadToCloudinary(files.badge[0].buffer, "teams/badges");
        }
        if (files.sponsor_logo?.[0]) {
          sponsor_logo = await uploadToCloudinary(files.sponsor_logo[0].buffer, "teams/sponsors");
        }
      }

      const teamRepository = new PrismaTeamRepository();
      const createTeamService = new CreateTeamService(teamRepository);

      const team = await createTeamService.execute(userId, { ...data, badge, sponsor_logo });

      return res.status(HTTP_STATUS.CREATED).json(team);
    } catch (error) {
      next(error);
    }
  }
}

import { Team } from "../../../../generated/prisma";
import { prisma } from "@/shared/infra/prisma/client";
import { ICreateTeamDTO, IUpdateTeamDTO, ITeamRepository } from "./ITeamRepository";

export class PrismaTeamRepository implements ITeamRepository {
  async create(data: ICreateTeamDTO): Promise<Team> {
    const team = await prisma.team.create({
      data: {
        user_id: data.user_id,
        name: data.name,
        color: data.color,
        badge: data.badge ?? null,
        year: data.year ?? null,
        sponsor: data.sponsor ?? null,
        sponsor_logo: data.sponsor_logo ?? null,
      },
    });

    return team;
  }

  async findById(id: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({
      where: { id },
    });

    return team;
  }

  async findByUserId(userId: string): Promise<Team[]> {
    const teams = await prisma.team.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    return teams;
  }

  async update(id: string, data: IUpdateTeamDTO): Promise<Team> {
    const team = await prisma.team.update({
      where: { id },
      data,
    });

    return team;
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({
      where: { id },
    });
  }
}

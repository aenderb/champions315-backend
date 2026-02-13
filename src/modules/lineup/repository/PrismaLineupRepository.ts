import { prisma } from "@/shared/infra/prisma/client";
import {
  ICreateLineupDTO,
  IUpdateLineupDTO,
  ILineupRepository,
  LineupWithPlayers,
} from "./ILineupRepository";

const includePlayersRelation = {
  starters: { orderBy: { number: "asc" as const } },
  bench: { orderBy: { number: "asc" as const } },
};

export class PrismaLineupRepository implements ILineupRepository {
  async create(data: ICreateLineupDTO): Promise<LineupWithPlayers> {
    const lineup = await prisma.lineup.create({
      data: {
        team_id: data.team_id,
        name: data.name,
        formation: data.formation ?? "4-3-1",
        starters: {
          connect: data.starter_ids.map((id) => ({ id })),
        },
        bench: {
          connect: data.bench_ids.map((id) => ({ id })),
        },
      },
      include: includePlayersRelation,
    });

    return lineup;
  }

  async findById(id: string): Promise<LineupWithPlayers | null> {
    const lineup = await prisma.lineup.findUnique({
      where: { id },
      include: includePlayersRelation,
    });

    return lineup;
  }

  async findByTeamId(teamId: string): Promise<LineupWithPlayers[]> {
    const lineups = await prisma.lineup.findMany({
      where: { team_id: teamId },
      include: includePlayersRelation,
      orderBy: { created_at: "desc" },
    });

    return lineups;
  }

  async update(id: string, data: IUpdateLineupDTO): Promise<LineupWithPlayers> {
    const lineup = await prisma.lineup.update({
      where: { id },
      data: {
        name: data.name,
        formation: data.formation,
        ...(data.starter_ids && {
          starters: {
            set: data.starter_ids.map((id) => ({ id })),
          },
        }),
        ...(data.bench_ids && {
          bench: {
            set: data.bench_ids.map((id) => ({ id })),
          },
        }),
      },
      include: includePlayersRelation,
    });

    return lineup;
  }

  async delete(id: string): Promise<void> {
    await prisma.lineup.delete({
      where: { id },
    });
  }
}

import { Player } from "../../../../generated/prisma";
import { prisma } from "@/shared/infra/prisma/client";
import { ICreatePlayerDTO, IUpdatePlayerDTO, IPlayerRepository } from "./IPlayerRepository";

export class PrismaPlayerRepository implements IPlayerRepository {
  async create(data: ICreatePlayerDTO): Promise<Player> {
    const player = await prisma.player.create({
      data: {
        team_id: data.team_id,
        number: data.number,
        name: data.name,
        birth_date: data.birth_date,
        avatar: data.avatar ?? null,
        position: data.position,
      },
    });

    return player;
  }

  async findById(id: string): Promise<Player | null> {
    const player = await prisma.player.findUnique({
      where: { id },
    });

    return player;
  }

  async findByTeamId(teamId: string): Promise<Player[]> {
    const players = await prisma.player.findMany({
      where: { team_id: teamId },
      orderBy: { number: "asc" },
    });

    return players;
  }

  async update(id: string, data: IUpdatePlayerDTO): Promise<Player> {
    const player = await prisma.player.update({
      where: { id },
      data,
    });

    return player;
  }

  async delete(id: string): Promise<void> {
    await prisma.player.delete({
      where: { id },
    });
  }
}

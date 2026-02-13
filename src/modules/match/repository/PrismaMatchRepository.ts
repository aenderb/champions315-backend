import { MatchCard } from "../../../../generated/prisma";
import { prisma } from "@/shared/infra/prisma/client";
import {
  ICreateMatchDTO,
  IUpdateMatchDTO,
  ICreateMatchCardDTO,
  IMatchRepository,
  MatchWithCards,
} from "./IMatchRepository";

const includeCards = {
  cards: {
    include: {
      player: {
        select: { id: true, name: true, number: true },
      },
    },
    orderBy: { minute: "asc" as const },
  },
};

export class PrismaMatchRepository implements IMatchRepository {
  async create(data: ICreateMatchDTO): Promise<MatchWithCards> {
    const match = await prisma.match.create({
      data: {
        team_id: data.team_id,
        opponent_name: data.opponent_name,
        team_score: data.team_score,
        opponent_score: data.opponent_score,
        date: data.date,
        notes: data.notes ?? null,
        cards: data.cards?.length
          ? {
              create: data.cards.map((c) => ({
                player_id: c.player_id,
                type: c.type,
                minute: c.minute ?? null,
              })),
            }
          : undefined,
      },
      include: includeCards,
    });

    return match as MatchWithCards;
  }

  async findById(id: string): Promise<MatchWithCards | null> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: includeCards,
    });

    return match as MatchWithCards | null;
  }

  async findByTeamId(teamId: string): Promise<MatchWithCards[]> {
    const matches = await prisma.match.findMany({
      where: { team_id: teamId },
      include: includeCards,
      orderBy: { date: "desc" },
    });

    return matches as MatchWithCards[];
  }

  async update(id: string, data: IUpdateMatchDTO): Promise<MatchWithCards> {
    const match = await prisma.match.update({
      where: { id },
      data,
      include: includeCards,
    });

    return match as MatchWithCards;
  }

  async delete(id: string): Promise<void> {
    await prisma.match.delete({
      where: { id },
    });
  }

  async addCard(matchId: string, data: ICreateMatchCardDTO): Promise<MatchCard> {
    const card = await prisma.matchCard.create({
      data: {
        match_id: matchId,
        player_id: data.player_id,
        type: data.type,
        minute: data.minute ?? null,
      },
    });

    return card;
  }

  async removeCard(cardId: string): Promise<void> {
    await prisma.matchCard.delete({
      where: { id: cardId },
    });
  }

  async findCardById(cardId: string): Promise<MatchCard | null> {
    const card = await prisma.matchCard.findUnique({
      where: { id: cardId },
    });

    return card;
  }
}

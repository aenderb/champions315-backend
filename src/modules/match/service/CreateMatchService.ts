import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IPlayerRepository } from "@/modules/player/repository/IPlayerRepository";
import { ICreateMatchInputDTO } from "../dto/CreateMatchDTO";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";
import { BadRequestError } from "@/shared/errors";
import { CardType } from "../../../../generated/prisma";

export class CreateMatchService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(userId: string, teamId: string, data: ICreateMatchInputDTO) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para registrar partidas neste time");
    }

    // Validar jogadores dos cartões pertencem ao time
    if (data.cards?.length) {
      const teamPlayers = await this.playerRepository.findByTeamId(teamId);
      const teamPlayerIds = new Set(teamPlayers.map((p) => p.id));

      for (const card of data.cards) {
        if (!teamPlayerIds.has(card.player_id)) {
          throw new BadRequestError(`Jogador ${card.player_id} não pertence a este time`);
        }
      }
    }

    const match = await this.matchRepository.create({
      team_id: teamId,
      opponent_name: data.opponent_name,
      team_score: data.team_score,
      opponent_score: data.opponent_score,
      date: new Date(data.date),
      notes: data.notes,
      cards: data.cards?.map((c) => ({
        player_id: c.player_id,
        type: c.type as CardType,
        minute: c.minute,
      })),
    });

    return match;
  }
}

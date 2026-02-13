import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IPlayerRepository } from "@/modules/player/repository/IPlayerRepository";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";
import { BadRequestError } from "@/shared/errors";
import { CardType } from "../../../../generated/prisma";

export class AddCardService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(matchId: string, userId: string, data: { player_id: string; type: string; minute?: number }) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Partida não encontrada");
    }

    const team = await this.teamRepository.findById(match.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para adicionar cartões nesta partida");
    }

    // Verificar se o jogador pertence ao time
    const player = await this.playerRepository.findById(data.player_id);

    if (!player || player.team_id !== match.team_id) {
      throw new BadRequestError("Jogador não pertence a este time");
    }

    const card = await this.matchRepository.addCard(matchId, {
      player_id: data.player_id,
      type: data.type as CardType,
      minute: data.minute,
    });

    return card;
  }
}

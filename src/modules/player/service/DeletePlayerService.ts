import { IPlayerRepository } from "../repository/IPlayerRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError, ForbiddenError, ConflictError } from "@/shared/errors";
import { prisma } from "@/shared/infra/prisma/client";

export class DeletePlayerService {
  constructor(
    private playerRepository: IPlayerRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(playerId: string, userId: string) {
    const player = await this.playerRepository.findById(playerId);

    if (!player) {
      throw new NotFoundError("Jogador não encontrado");
    }

    const team = await this.teamRepository.findById(player.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir este jogador");
    }

    // Verificar se o jogador está em alguma escalação
    const lineupCount = await prisma.lineup.count({
      where: {
        OR: [
          { starters: { some: { id: playerId } } },
          { bench: { some: { id: playerId } } },
        ],
      },
    });

    if (lineupCount > 0) {
      throw new ConflictError(
        `Não é possível excluir o jogador. Ele está em ${lineupCount} escalação(ões). Remova-o das escalações primeiro.`
      );
    }

    // Verificar se o jogador tem cartões em partidas
    const cardCount = await prisma.matchCard.count({
      where: { player_id: playerId },
    });

    if (cardCount > 0) {
      throw new ConflictError(
        `Não é possível excluir o jogador. Ele possui ${cardCount} cartão(ões) registrado(s). Remova-os primeiro.`
      );
    }

    await this.playerRepository.delete(playerId);
  }
}

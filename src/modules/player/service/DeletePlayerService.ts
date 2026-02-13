import { IPlayerRepository } from "../repository/IPlayerRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

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

    await this.playerRepository.delete(playerId);
  }
}

import { ITeamRepository } from "../repository/ITeamRepository";
import { IPlayerRepository } from "@/modules/player/repository/IPlayerRepository";
import { NotFoundError, ForbiddenError, ConflictError } from "@/shared/errors";

export class DeleteTeamService {
  constructor(
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(teamId: string, userId: string) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir este time");
    }

    // Verificar dependências antes de excluir
    const playerCount = await this.playerRepository.countByTeamId(teamId);
    if (playerCount > 0) {
      throw new ConflictError(
        `Não é possível excluir o time. Existem ${playerCount} jogador(es) associado(s). Remova-os primeiro.`
      );
    }

    await this.teamRepository.delete(teamId);
  }
}

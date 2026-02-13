import { ILineupRepository } from "../repository/ILineupRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError, ForbiddenError } from "@/shared/errors";

export class DeleteLineupService {
  constructor(
    private lineupRepository: ILineupRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(lineupId: string, userId: string) {
    const lineup = await this.lineupRepository.findById(lineupId);

    if (!lineup) {
      throw new NotFoundError("Escalação não encontrada");
    }

    const team = await this.teamRepository.findById(lineup.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir esta escalação");
    }

    await this.lineupRepository.delete(lineupId);
  }
}

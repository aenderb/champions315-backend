import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

export class DeleteMatchService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(matchId: string, userId: string) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Partida não encontrada");
    }

    const team = await this.teamRepository.findById(match.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir esta partida");
    }

    await this.matchRepository.delete(matchId);
  }
}

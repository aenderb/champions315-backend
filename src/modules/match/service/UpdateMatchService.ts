import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IUpdateMatchInputDTO } from "../dto/UpdateMatchDTO";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

export class UpdateMatchService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(matchId: string, userId: string, data: IUpdateMatchInputDTO) {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Partida não encontrada");
    }

    const team = await this.teamRepository.findById(match.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para editar esta partida");
    }

    const updatedMatch = await this.matchRepository.update(matchId, {
      opponent_name: data.opponent_name,
      team_score: data.team_score,
      opponent_score: data.opponent_score,
      date: data.date ? new Date(data.date) : undefined,
      notes: data.notes,
    });

    return updatedMatch;
  }
}

import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";

export class GetMatchesByTeamService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(teamId: string) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    const matches = await this.matchRepository.findByTeamId(teamId);

    return matches;
  }
}

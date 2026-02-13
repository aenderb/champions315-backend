import { ILineupRepository } from "../repository/ILineupRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";

export class GetLineupsByTeamService {
  constructor(
    private lineupRepository: ILineupRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(teamId: string) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    const lineups = await this.lineupRepository.findByTeamId(teamId);

    return lineups;
  }
}

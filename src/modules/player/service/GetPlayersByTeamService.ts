import { IPlayerRepository } from "../repository/IPlayerRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";

export class GetPlayersByTeamService {
  constructor(
    private playerRepository: IPlayerRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(teamId: string) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    const players = await this.playerRepository.findByTeamId(teamId);

    return players;
  }
}

import { ITeamRepository } from "../repository/ITeamRepository";

export class GetTeamsByUserService {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(userId: string) {
    const teams = await this.teamRepository.findByUserId(userId);

    return teams;
  }
}

import { ITeamRepository } from "../repository/ITeamRepository";
import { ICreateTeamInputDTO } from "../dto/CreateTeamDTO";

export class CreateTeamService {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(userId: string, data: ICreateTeamInputDTO) {
    const team = await this.teamRepository.create({
      user_id: userId,
      name: data.name,
      color: data.color,
      badge: data.badge,
      year: data.year,
      sponsor: data.sponsor,
      sponsor_logo: data.sponsor_logo,
    });

    return team;
  }
}

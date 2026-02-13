import { ITeamRepository } from "../repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";

export class GetTeamByIdService {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string) {
    const team = await this.teamRepository.findById(id);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    return team;
  }
}

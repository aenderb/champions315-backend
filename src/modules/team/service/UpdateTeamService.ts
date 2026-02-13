import { ITeamRepository } from "../repository/ITeamRepository";
import { IUpdateTeamInputDTO } from "../dto/UpdateTeamDTO";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

export class UpdateTeamService {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(teamId: string, userId: string, data: IUpdateTeamInputDTO) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para editar este time");
    }

    const updatedTeam = await this.teamRepository.update(teamId, data);

    return updatedTeam;
  }
}

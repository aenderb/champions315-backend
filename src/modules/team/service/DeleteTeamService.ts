import { ITeamRepository } from "../repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

export class DeleteTeamService {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(teamId: string, userId: string) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir este time");
    }

    await this.teamRepository.delete(teamId);
  }
}

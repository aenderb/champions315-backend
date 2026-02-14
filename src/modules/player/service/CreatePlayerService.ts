import { IPlayerRepository } from "../repository/IPlayerRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { ICreatePlayerInputDTO } from "../dto/CreatePlayerDTO";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";
import { Position, FieldRole } from "../../../../generated/prisma";

export class CreatePlayerService {
  constructor(
    private playerRepository: IPlayerRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(userId: string, teamId: string, data: ICreatePlayerInputDTO) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para adicionar jogadores neste time");
    }

    // Se a posição for GK, field_role é sempre GK
    const fieldRole = data.position === "GK" ? "GK" : data.field_role;

    console.log("[CreatePlayerService] position:", data.position, "| field_role recebido:", data.field_role, "| fieldRole calculado:", fieldRole);

    const player = await this.playerRepository.create({
      team_id: teamId,
      number: data.number,
      name: data.name,
      birth_date: new Date(data.birth_date),
      avatar: data.avatar,
      position: data.position as Position,
      field_role: fieldRole as FieldRole | undefined,
    });

    return player;
  }
}

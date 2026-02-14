import { IPlayerRepository } from "../repository/IPlayerRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IUpdatePlayerInputDTO } from "../dto/UpdatePlayerDTO";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";
import { Position, FieldRole } from "../../../../generated/prisma";

export class UpdatePlayerService {
  constructor(
    private playerRepository: IPlayerRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(playerId: string, userId: string, data: IUpdatePlayerInputDTO) {
    const player = await this.playerRepository.findById(playerId);

    if (!player) {
      throw new NotFoundError("Jogador não encontrado");
    }

    const team = await this.teamRepository.findById(player.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para editar este jogador");
    }

    // Determina field_role: se position for GK (vindo no body ou já existente), força GK
    const effectivePosition = data.position ?? player.position;
    const fieldRole = effectivePosition === "GK" ? "GK" : data.field_role;

    const updatedPlayer = await this.playerRepository.update(playerId, {
      number: data.number,
      name: data.name,
      birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
      avatar: data.avatar,
      position: data.position as Position | undefined,
      field_role: fieldRole as FieldRole | null | undefined,
    });

    return updatedPlayer;
  }
}

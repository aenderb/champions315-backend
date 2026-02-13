import { ILineupRepository } from "../repository/ILineupRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IPlayerRepository } from "@/modules/player/repository/IPlayerRepository";
import { IUpdateLineupInputDTO } from "../dto/UpdateLineupDTO";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/shared/errors";

const PLAYERS_ON_FIELD = 9;

export class UpdateLineupService {
  constructor(
    private lineupRepository: ILineupRepository,
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(lineupId: string, userId: string, data: IUpdateLineupInputDTO) {
    const lineup = await this.lineupRepository.findById(lineupId);

    if (!lineup) {
      throw new NotFoundError("Escalação não encontrada");
    }

    const team = await this.teamRepository.findById(lineup.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para editar esta escalação");
    }

    if (data.starter_ids) {
      if (data.starter_ids.length !== PLAYERS_ON_FIELD) {
        throw new BadRequestError(`A escalação deve ter exatamente ${PLAYERS_ON_FIELD} titulares`);
      }

      const uniqueStarters = new Set(data.starter_ids);
      if (uniqueStarters.size !== data.starter_ids.length) {
        throw new BadRequestError("Não pode haver jogadores duplicados entre os titulares");
      }
    }

    if (data.starter_ids && data.bench_ids) {
      const duplicates = data.starter_ids.filter((id) => data.bench_ids.includes(id));
      if (duplicates.length > 0) {
        throw new BadRequestError("Um jogador não pode ser titular e reserva ao mesmo tempo");
      }
    }

    // Verificar se todos os jogadores pertencem ao time
    const allPlayerIds = [...(data.starter_ids || []), ...(data.bench_ids || [])];
    if (allPlayerIds.length > 0) {
      const teamPlayers = await this.playerRepository.findByTeamId(lineup.team_id);
      const teamPlayerIds = new Set(teamPlayers.map((p) => p.id));
      const invalidPlayers = allPlayerIds.filter((id) => !teamPlayerIds.has(id));

      if (invalidPlayers.length > 0) {
        throw new BadRequestError("Alguns jogadores não pertencem a este time");
      }
    }

    const updatedLineup = await this.lineupRepository.update(lineupId, {
      name: data.name,
      formation: data.formation,
      starter_ids: data.starter_ids,
      bench_ids: data.bench_ids,
    });

    return updatedLineup;
  }
}

import { ILineupRepository } from "../repository/ILineupRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { IPlayerRepository } from "@/modules/player/repository/IPlayerRepository";
import { ICreateLineupInputDTO } from "../dto/CreateLineupDTO";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/shared/errors";

const PLAYERS_ON_FIELD = 9;

export class CreateLineupService {
  constructor(
    private lineupRepository: ILineupRepository,
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(userId: string, teamId: string, data: ICreateLineupInputDTO) {
    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new NotFoundError("Time não encontrado");
    }

    if (team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para criar escalações neste time");
    }

    if (data.starter_ids.length !== PLAYERS_ON_FIELD) {
      throw new BadRequestError(`A escalação deve ter exatamente ${PLAYERS_ON_FIELD} titulares`);
    }

    // Verificar duplicados entre titulares
    const uniqueStarters = new Set(data.starter_ids);
    if (uniqueStarters.size !== data.starter_ids.length) {
      throw new BadRequestError("Não pode haver jogadores duplicados entre os titulares");
    }

    // Verificar se jogador não está em ambas as listas
    const duplicates = data.starter_ids.filter((id) => data.bench_ids.includes(id));
    if (duplicates.length > 0) {
      throw new BadRequestError("Um jogador não pode ser titular e reserva ao mesmo tempo");
    }

    // Verificar se todos os jogadores pertencem ao time
    const teamPlayers = await this.playerRepository.findByTeamId(teamId);
    const teamPlayerIds = new Set(teamPlayers.map((p) => p.id));
    const allPlayerIds = [...data.starter_ids, ...data.bench_ids];
    const invalidPlayers = allPlayerIds.filter((id) => !teamPlayerIds.has(id));

    if (invalidPlayers.length > 0) {
      throw new BadRequestError("Alguns jogadores não pertencem a este time");
    }

    const lineup = await this.lineupRepository.create({
      team_id: teamId,
      name: data.name,
      formation: data.formation,
      starter_ids: data.starter_ids,
      bench_ids: data.bench_ids,
    });

    return lineup;
  }
}

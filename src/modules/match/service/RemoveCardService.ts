import { IMatchRepository } from "../repository/IMatchRepository";
import { ITeamRepository } from "@/modules/team/repository/ITeamRepository";
import { NotFoundError } from "@/shared/errors";
import { ForbiddenError } from "@/shared/errors";

export class RemoveCardService {
  constructor(
    private matchRepository: IMatchRepository,
    private teamRepository: ITeamRepository,
  ) {}

  async execute(cardId: string, userId: string) {
    const card = await this.matchRepository.findCardById(cardId);

    if (!card) {
      throw new NotFoundError("Cartão não encontrado");
    }

    const match = await this.matchRepository.findById(card.match_id);

    if (!match) {
      throw new NotFoundError("Partida não encontrada");
    }

    const team = await this.teamRepository.findById(match.team_id);

    if (!team || team.user_id !== userId) {
      throw new ForbiddenError("Você não tem permissão para remover este cartão");
    }

    await this.matchRepository.removeCard(cardId);
  }
}

import { IMatchRepository } from "../repository/IMatchRepository";
import { NotFoundError } from "@/shared/errors";

export class GetMatchByIdService {
  constructor(private matchRepository: IMatchRepository) {}

  async execute(id: string) {
    const match = await this.matchRepository.findById(id);

    if (!match) {
      throw new NotFoundError("Partida não encontrada");
    }

    return match;
  }
}

import { IPlayerRepository } from "../repository/IPlayerRepository";
import { NotFoundError } from "@/shared/errors";

export class GetPlayerByIdService {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(id: string) {
    const player = await this.playerRepository.findById(id);

    if (!player) {
      throw new NotFoundError("Jogador não encontrado");
    }

    return player;
  }
}

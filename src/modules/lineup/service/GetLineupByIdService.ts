import { ILineupRepository } from "../repository/ILineupRepository";
import { NotFoundError } from "@/shared/errors";

export class GetLineupByIdService {
  constructor(private lineupRepository: ILineupRepository) {}

  async execute(id: string) {
    const lineup = await this.lineupRepository.findById(id);

    if (!lineup) {
      throw new NotFoundError("Escalação não encontrada");
    }

    return lineup;
  }
}

import { IUserRepository } from "../repository/IUserRepository";
import { NotFoundError } from "@/shared/errors";

export class UpdateUserAvatarService {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, avatarUrl: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const updated = await this.userRepository.updateAvatar(userId, avatarUrl);

    return updated;
  }
}

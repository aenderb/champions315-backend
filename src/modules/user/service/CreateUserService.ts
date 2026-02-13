// CreateUserService

import { User } from "../../../generated/prisma";
import { hash, genSalt } from "bcryptjs";
import { ConflictError } from "@/shared/errors";
import { IUserRepository } from "../repository/IUserRepository";
import { ICreateUserRequest } from "../dto/CreateUserDTO";

export class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password, avatar }: ICreateUserRequest): Promise<User> {
    // Verificar se o usuário já existe
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new ConflictError("User already exists");
    }

    // Hash da senha
    const salt = await genSalt(10);
    const password_hash = await hash(password, salt);

    // Criar o usuário
    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
      avatar,
    });

    return user;
  }
}

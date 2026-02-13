// IUserRepository

import { User } from "../../../../generated/prisma";

// DTO para o Repository - Dados já processados
export interface ICreateUserDTO {
  name: string;
  email: string;
  password_hash: string;
  avatar?: string;
}

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<Omit<User, 'password_hash'> | null>;
}

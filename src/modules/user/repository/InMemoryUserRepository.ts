import { User } from "../../../../generated/prisma";
import { randomUUID } from "node:crypto";
import { IUserRepository, ICreateUserDTO } from "./IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(data: ICreateUserDTO): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      avatar: data.avatar ?? null,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }

  async findById(id: string): Promise<Omit<User, "password_hash"> | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateAvatar(id: string, avatar: string): Promise<Omit<User, "password_hash">> {
    const index = this.users.findIndex((user) => user.id === id);

    this.users[index].avatar = avatar;

    const { password_hash, ...userWithoutPassword } = this.users[index];

    return userWithoutPassword;
  }
}

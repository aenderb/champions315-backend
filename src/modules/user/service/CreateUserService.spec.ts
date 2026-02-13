import { describe, it, expect, beforeEach } from "vitest";
import { CreateUserService } from "./CreateUserService";
import { InMemoryUserRepository } from "../repository/InMemoryUserRepository";
import { compare } from "bcryptjs";
import { ConflictError } from "@/shared/errors";

describe("CreateUserService", () => {
  let createUserService: CreateUserService;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    createUserService = new CreateUserService(inMemoryUserRepository);
  });

  it("should hash user password upon creation", async () => {
    const userData = {
      name: "Jonh Doe",
      email: "john.doe@example.com",
      password: "123456",
    };

    const user = await createUserService.execute(userData);

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should be able to create a new user", async () => {
    const userData = {
      name: "Jonh Doe",
      email: "john.doe@example.com",
      password: "123456",
    };

    const user = await createUserService.execute(userData);

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it("should not be able to create user with same email twice", async () => {
    const userData = {
      name: "Jonh Doe",
      email: "john.doe@example.com",
      password: "123456",
    };

    await createUserService.execute(userData);

    await expect(() =>
      createUserService.execute(userData)
    ).rejects.toBeInstanceOf(ConflictError);
  });
});


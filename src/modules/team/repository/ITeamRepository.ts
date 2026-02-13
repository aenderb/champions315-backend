import { Team } from "../../../../generated/prisma";

export interface ICreateTeamDTO {
  user_id: string;
  name: string;
  color: string;
  badge?: string;
  year?: number;
  sponsor?: string;
  sponsor_logo?: string;
}

export interface IUpdateTeamDTO {
  name?: string;
  color?: string;
  badge?: string | null;
  year?: number | null;
  sponsor?: string | null;
  sponsor_logo?: string | null;
}

export interface ITeamRepository {
  create(data: ICreateTeamDTO): Promise<Team>;
  findById(id: string): Promise<Team | null>;
  findByUserId(userId: string): Promise<Team[]>;
  update(id: string, data: IUpdateTeamDTO): Promise<Team>;
  delete(id: string): Promise<void>;
}

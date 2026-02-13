import { Player, Position, FieldRole } from "../../../../generated/prisma";

export interface ICreatePlayerDTO {
  team_id: string;
  number: number;
  name: string;
  birth_date: Date;
  avatar?: string;
  position: Position;
  field_role?: FieldRole;
}

export interface IUpdatePlayerDTO {
  number?: number;
  name?: string;
  birth_date?: Date;
  avatar?: string | null;
  position?: Position;
  field_role?: FieldRole | null;
}

export interface IPlayerRepository {
  create(data: ICreatePlayerDTO): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  findByTeamId(teamId: string): Promise<Player[]>;
  update(id: string, data: IUpdatePlayerDTO): Promise<Player>;
  delete(id: string): Promise<void>;
}

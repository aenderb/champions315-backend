import { Lineup, Player } from "../../../../generated/prisma";

export interface ICreateLineupDTO {
  team_id: string;
  name: string;
  formation?: string;
  starter_ids: string[];
  bench_ids: string[];
}

export interface IUpdateLineupDTO {
  name?: string;
  formation?: string;
  starter_ids?: string[];
  bench_ids?: string[];
}

export type LineupWithPlayers = Lineup & {
  starters: Player[];
  bench: Player[];
};

export interface ILineupRepository {
  create(data: ICreateLineupDTO): Promise<LineupWithPlayers>;
  findById(id: string): Promise<LineupWithPlayers | null>;
  findByTeamId(teamId: string): Promise<LineupWithPlayers[]>;
  update(id: string, data: IUpdateLineupDTO): Promise<LineupWithPlayers>;
  delete(id: string): Promise<void>;
}

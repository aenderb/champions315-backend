import { Match, MatchCard, CardType } from "../../../../generated/prisma";

export interface ICreateMatchCardDTO {
  player_id: string;
  type: CardType;
  minute?: number;
}

export interface ICreateMatchDTO {
  team_id: string;
  opponent_name: string;
  team_score: number;
  opponent_score: number;
  date: Date;
  notes?: string;
  cards?: ICreateMatchCardDTO[];
}

export interface IUpdateMatchDTO {
  opponent_name?: string;
  team_score?: number;
  opponent_score?: number;
  date?: Date;
  notes?: string | null;
}

export type MatchWithCards = Match & { cards: (MatchCard & { player: { id: string; name: string; number: number } })[] };

export interface IMatchRepository {
  create(data: ICreateMatchDTO): Promise<MatchWithCards>;
  findById(id: string): Promise<MatchWithCards | null>;
  findByTeamId(teamId: string): Promise<MatchWithCards[]>;
  update(id: string, data: IUpdateMatchDTO): Promise<MatchWithCards>;
  delete(id: string): Promise<void>;
  addCard(matchId: string, data: ICreateMatchCardDTO): Promise<MatchCard>;
  removeCard(cardId: string): Promise<void>;
  findCardById(cardId: string): Promise<MatchCard | null>;
}

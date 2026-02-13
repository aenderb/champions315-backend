export interface ICreateMatchCardInputDTO {
  player_id: string;
  type: "YELLOW" | "RED";
  minute?: number;
}

export interface ICreateMatchInputDTO {
  opponent_name: string;
  team_score: number;
  opponent_score: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  cards?: ICreateMatchCardInputDTO[];
}

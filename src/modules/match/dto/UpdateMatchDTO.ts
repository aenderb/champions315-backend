export interface IUpdateMatchInputDTO {
  opponent_name?: string;
  team_score?: number;
  opponent_score?: number;
  date?: string; // YYYY-MM-DD
  notes?: string | null;
}

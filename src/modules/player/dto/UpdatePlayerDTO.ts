export interface IUpdatePlayerInputDTO {
  number?: number;
  name?: string;
  birth_date?: string; // "YYYY-MM-DD"
  avatar?: string | null;
  position?: "GK" | "DEF" | "MID" | "FWD";
}

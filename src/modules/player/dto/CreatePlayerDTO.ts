export interface ICreatePlayerInputDTO {
  number: number;
  name: string;
  birth_date: string; // "YYYY-MM-DD"
  avatar?: string;
  position: "GK" | "DEF" | "MID" | "FWD";
}

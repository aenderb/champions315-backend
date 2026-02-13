export interface ICreateLineupInputDTO {
  name: string;
  formation?: string; // default "4-3-1"
  starter_ids: string[]; // UUIDs dos 9 titulares
  bench_ids: string[]; // UUIDs dos reservas
}

export interface PlayerType {
  id: number;
  club_id: number;
  name: string;
}

export type PlayerFormType = Omit<PlayerType, "id">;

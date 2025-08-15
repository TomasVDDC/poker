export interface PlayerType {
  id: number;
  club_id: number;
  name: string;
  net_profit?: number;
}

export type PlayerFormType = Omit<PlayerType, "id">;

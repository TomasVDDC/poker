export interface PlayerType {
  id: number;
  club_id: number;
  name: string;
  net_profit?: string;
  winning_streak?: number;
}

export type PlayerFormType = Omit<PlayerType, "id" | "net_profit" | "club_id">;

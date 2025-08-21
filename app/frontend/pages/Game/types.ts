// Mathes the game model
export interface GameType {
  id: number;
  club_id: number;
  buy_in: number;
  formatted_buy_in: string;
  date: string;
}

// For displaying in the a table
export type GameListItemType = {
  id: number;
  club_id: number;
  pot: number;
  formatted_buy_in: string;
  date: string;
};

export type GameFormType = Omit<GameType, "id" | "club_id">;

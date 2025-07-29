// Mathes the game model
export interface GameType {
  id: number;
  buy_in: number;
}

// For displaying in the a table
export type GameListItemType = {
  id: number;
  club_id: number;
  formatted_buy_in: string;
  formatted_created_at: string;
};

export type GameFormType = Omit<GameType, "id">;

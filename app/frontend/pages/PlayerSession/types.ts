export interface PlayerSessionType {
  id: number;
  player_id: number;
  game_id: number;
  number_of_buy_ins: number;
  winnings: number;
}
export type PlayerSessionListItemType = {
  id: number;
  club_id: number;
  game_id: number;
  player_name: string;
  number_of_buy_ins: number;
  net_profit_or_loss: string;
  formatted_winnings: number;
  formatted_created_at: string;
};

export type PlayerSessionFormType = Omit<PlayerSessionType, "id">;

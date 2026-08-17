export interface PlayerSessionType {
  id: number;
  player_id: number;
  game_id: number;
  // Money actually put in over the whole session, rebuys included.
  amount_in: number;
  // Money taken off the table at the end.
  amount_out: number;
}
export type PlayerSessionListItemType = {
  id: number;
  club_id: number;
  game_id: number;
  player_name: string;
  formatted_amount_in: string;
  formatted_amount_out: string;
  net_profit_or_loss: string;
  formatted_created_at: string;
};

export type PlayerSessionFormType = Omit<
  PlayerSessionType,
  "id" | "player_id" | "game_id"
>;

export interface PlayerSessionType {
  id: number;
  number_of_buy_ins: number;
  winnings: number;
}
export type PlayerSessionListItemType = {
  id: number;
  club_id: number;
  number_of_buy_ins: number;
  formatted_winnings: number;
  formatted_created_at: string;
};

export type PlayerSessionFormType = Omit<PlayerSessionType, "id">;

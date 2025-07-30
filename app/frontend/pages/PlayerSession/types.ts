export interface PlayerSessionType {
  id: number
  number_of_buy_ins: number
  winnings: number
}

export type PlayerSessionFormType = Omit<PlayerSessionType, 'id'>

export interface GameType {
  id: number
  buy_in: number
}

export type GameFormType = Omit<GameType, 'id'>

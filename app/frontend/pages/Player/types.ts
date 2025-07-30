export interface PlayerType {
  id: number
  name: string
}

export type PlayerFormType = Omit<PlayerType, 'id'>

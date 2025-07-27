export interface ClubType {
  id: number
  name: string
}

export type ClubFormType = Omit<ClubType, 'id'>

export interface ClubType {
  id: number;
  name: string;
  share_token: string;
}

export type ClubFormType = Omit<ClubType, "id">;

export interface ClubType {
  id: number;
  name: string;
  share_token: string;
  currency: string;
}

export type ClubFormType = Omit<ClubType, "id" | "share_token">;

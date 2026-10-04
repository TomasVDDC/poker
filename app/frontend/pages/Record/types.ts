export type RecordKey = "biggest_win" | "biggest_loss";

export interface RecordChartPoint {
  date: string;
  player?: string;
  biggest_win?: number;
  biggest_loss?: number;
}

export interface RecordStats {
  player_name: string | null;
  amount: string | null;
  times_broken: number;
}

export const recordDetails = {
  biggest_win: { label: "Biggest Win", color: "#16a34a" },
  biggest_loss: { label: "Biggest Loss", color: "#dc2626" },
} as const;

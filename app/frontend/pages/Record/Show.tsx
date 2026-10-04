import { Head, router } from "@inertiajs/react";
import { ClubType } from "../Club/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Chart } from "@/pages/Record/components/chart";
import {
  RecordChartPoint,
  RecordKey,
  RecordStats,
  recordDetails,
} from "./types";

interface ShowProps {
  club: ClubType;
  record: RecordKey;
  chart_data: RecordChartPoint[];
  stats: RecordStats;
  read_only: boolean;
  share_token?: string;
}

export default function Show({
  club,
  record,
  chart_data,
  stats,
  read_only,
  share_token,
}: ShowProps) {
  const { label } = recordDetails[record];
  const isWin = record === "biggest_win";

  return (
    <>
      <Head title={`${club.name} – ${label}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          <h1 className="font-bold text-4xl">{label}</h1>

          <h2 className="mt-8 mb-3 font-semibold text-lg text-muted-foreground">
            Statistics
          </h2>
          <Card className="shadow-sm rounded-xl">
            <CardContent className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">Held By</p>
                <p className="text-xl font-bold">{stats.player_name ?? "–"}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">Amount</p>
                <p
                  className={`text-xl font-bold ${
                    isWin ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.amount ?? "–"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">Times Broken</p>
                <p className="text-xl font-bold">{stats.times_broken}</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="mt-8 mb-3 font-semibold text-lg text-muted-foreground">
            Record History
          </h2>
          <Chart data={chart_data} record={record} currency={club.currency} />

          <Button
            onClick={() =>
              read_only
                ? router.get(`/clubs/shared/${share_token}`)
                : router.get(`/clubs/${club.id}`)
            }
            className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
          >
            Back to club
          </Button>
        </div>
      </div>
    </>
  );
}

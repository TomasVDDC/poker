import { Link, router, usePage } from "@inertiajs/react";
import { ClubType } from "./types";
import { GameListItemType } from "../Game/types";
import { PlayerType } from "../Player/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameTable } from "./components/GameTable";
import { ChartLineMultiple } from "@/pages/Club/components/chart-line-multiple";

interface ShowProps {
  club: ClubType;
  games: GameListItemType[];
  players: PlayerType[];
  read_only: Boolean;
  flash: { notice?: string };
}

export default function Show({
  club,
  players,
  games,
  chart_data,
  read_only,
  flash,
}: ShowProps) {
  const assetsPath = usePage().props;

  console.log("Show props:", {
    club,
    games,
    players,
    chart_data,
    read_only,
    flash,
    assetsPath,
  });
  return (
    <>
      <div className="mx-auto container p-3">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-2xl sm:text-4xl sm:mb-9">
            {" "}
            {club.name}
          </h1>

          <Card className="p-4 shadow-md rounded-2xl mt-4">
            <h1 className="font-bold text-xl sm:text-2xl">Leaderboard</h1>
            <div className="divide-y divide-gray-200">
              {players.map((player, index) => (
                <div
                  key={player.name}
                  className="flex justify-between items-center py-2 text-sm sm:text-base"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-6 text-center">
                      {index + 1}
                    </span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">
                      {player.name}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      player.net_profit.includes("-")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {player.net_profit}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <ChartLineMultiple data={chart_data} players={players} />

          <div className="my-10">
            <div className="flex flex-row">
              <h1 className="font-bold text-xl sm:text-2xl mr-auto">
                Game Log
              </h1>

              {!read_only && (
                <Button
                  className="my-2 sm:text-base text-sm"
                  onClick={() => router.visit(`/clubs/${club.id}/games/new`)}
                >
                  New Game
                </Button>
              )}
            </div>
            <GameTable games={games} read_only={read_only} />
          </div>

          {!read_only && (
            <>
              <Link
                href="/clubs"
                className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block sm:text-base text-sm"
              >
                Back to clubs
              </Link>
              <div className="inline-block ml-2">
                <Link
                  href={`/clubs/${club.id}`}
                  as="button"
                  method="delete"
                  className="mt-2 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
                >
                  Destroy this club
                </Link>
                <Link
                  href={`/clubs/${club.id}/edit`}
                  as="button"
                  method="get"
                  className="ml-2 mt-2 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
                >
                  Edit this club
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

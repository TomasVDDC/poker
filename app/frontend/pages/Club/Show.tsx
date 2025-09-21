import { Link, router, usePage } from "@inertiajs/react";
import { ClubType } from "./types";
import { GameListItemType } from "../Game/types";
import { PlayerType } from "../Player/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { GameTable } from "./components/GameTable";
import { ChartLineMultiple } from "@/pages/Club/components/chart-line-multiple";

interface ShowProps {
  club: ClubType;
  games: GameListItemType[];
  players: PlayerType[];
  read_only: boolean;
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
  const shareUrl = `https://${window.location.host}/clubs/shared/${club.share_token}`;

  return (
    <>
      <div className="mx-auto container p-3">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          {/* Club name as the title and URL for sharing */}
          <div className="flex sm:flex-row flex-col sm:gap-6 gap-2 sm:mb-9">
            <div className="flex flex-row gap-2 items-center">
              <img src="/icon.svg" className="w-9 h-9" alt="Logo" />
              <h1 className="font-bold text-2xl sm:text-4xl ">{club.name}</h1>
            </div>

            {!read_only && (
              <div className="flex items-center gap-2">
                <span className="truncate p-1 w-60  border-stone-500 border-2 text-sm sm:text-base rounded-2xl text-gray-500">
                  {shareUrl}
                </span>
                <CopyButton content={shareUrl} />
              </div>
            )}
          </div>

          {/* Player Leaderboard */}
          <Card className="p-4 shadow-md rounded-2xl my-5">
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
                      player.net_profit?.includes("-")
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

          {/* Chart of players net profit over time */}
          <ChartLineMultiple data={chart_data} players={players} />

          {/* Game Log */}
          <div className="my-4">
            <div className="flex flex-row items-center mb-3">
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

          {/* Useful buttons for the club*/}
          {!read_only && (
            <>
              <Button
                onClick={() => router.get("/clubs/")}
                className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
              >
                Back to clubs
              </Button>
              <div className="inline-block ml-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer">
                      Destroy this club
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => router.delete(`/clubs/${club.id}`)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>{" "}
                <Button
                  onClick={() => router.get(`/clubs/${club.id}/edit`)}
                  className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
                >
                  Edit this club
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

import { Head, router } from "@inertiajs/react";
import { GameType } from "./types";
import { ClubType } from "@/pages/Club/types";
import { PlayerSessionTable } from "./components/PlayerSessionTable";
import { PlayerSessionListItemType } from "../PlayerSession/types";
import { Button } from "@/components/ui/button";

interface ShowProps {
  club: ClubType;
  game: GameType;
  player_sessions: PlayerSessionListItemType[];
  conservation_of_currency: string;
  read_only?: boolean;
  flash: { notice?: string };
}

export default function Show({
  club,
  game,
  player_sessions,
  conservation_of_currency,
  read_only,
  flash,
}: ShowProps) {
  console.log("Show props:", {
    club,
    game,
    player_sessions,
    conservation_of_currency,
    read_only,
  });
  return (
    <>
      <Head title={`Game #${game.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-4 sm:px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">Game #{game.id}</h1>
          <div className="text-xl mt-2">Buy in: {game.buy_in}</div>
          <div className=" my-6 sm:my-10">
            <div className="flex flex-row items-center mb-3">
              <h1 className="font-bold text-2xl mr-auto"> Player Sessions</h1>
              {!read_only && (
                <Button
                  className="my-2 text-xs sm:text-base cursor-pointer"
                  onClick={() =>
                    router.visit(
                      `/clubs/${club.id}/games/${game.id}/player_sessions/new`,
                    )
                  }
                >
                  New Player Session
                </Button>
              )}
            </div>
            <PlayerSessionTable
              player_sessions={player_sessions}
              isReadOnly={read_only}
            />
            {parseFloat(conservation_of_currency) != 0 && (
              <div className="text-red-500 mt-4  text-xs sm:text-base">
                {`The sum of net profit/loss is not equal to 0. Double check your
                input! (currently equal to ${Math.round(parseFloat(conservation_of_currency))})`}
              </div>
            )}
          </div>
          <Button
            className="rounded-sm  py-6 px-5 sm:text-base cursor-pointer"
            variant={"secondary"}
            onClick={
              read_only
                ? () =>
                    router.visit(
                      `/clubs/shared/${window.location.pathname.split("/")[3]}`,
                    )
                : () => router.visit(`/clubs/${club.id}/`)
            }
          >
            Back to Club
          </Button>
        </div>
      </div>
    </>
  );
}

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
  flash: { notice?: string };
}

export default function Show({
  club,
  game,
  player_sessions,
  flash,
}: ShowProps) {
  console.log("Show props:", { club, game, player_sessions });
  return (
    <>
      <Head title={`Game #${game.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">Game #{game.id}</h1>

          <div className="my-10">
            <div className="flex flex-row">
              <h1 className="font-bold text-2xl mr-auto"> Player Sessions</h1>
              <Button
                className="my-2 cursor-pointer"
                onClick={() =>
                  router.visit(
                    `/clubs/${club.id}/games/${game.id}/player_sessions/new`,
                  )
                }
              >
                New Player Session
              </Button>
            </div>
            <PlayerSessionTable player_sessions={player_sessions} />
          </div>

          <Button
            className="rounded-sm ml-3 py-6 px-5 text-md cursor-pointer"
            variant={"secondary"}
            onClick={() => router.visit(`/clubs/${club.id}/`)}
          >
            Back to Club
          </Button>
        </div>
      </div>
    </>
  );
}

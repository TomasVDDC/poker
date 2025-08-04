import { Link, router } from "@inertiajs/react";
import { ClubType } from "./types";
import { GameListItemType } from "../Game/types";
import { PlayerType } from "../Player/types";
import { Button } from "@/components/ui/button";
import { GameTable, ColumnHeaders } from "./components/GameTable";
import { PlayerDropdownMenu } from "./components/PlayerDropdownMenu";

interface ShowProps {
  club: ClubType;
  games: GameListItemType[];
  players: PlayerType[];
  flash: { notice?: string };
}

export default function Show({ club, players, games, flash }: ShowProps) {
  console.log("Show props:", { club, games, flash });
  return (
    <>
      <div className="mx-auto container">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl mb-9"> {club.name}</h1>
          <div className="flex flex-row">
            <Button
              className="mr-2"
              onClick={() => router.visit(`/clubs/${club.id}/players/new`)}
            >
              New Player
            </Button>
            <div className="flex flex-row gap-3">
              {players.map((player) => (
                <div className="flex items-center">
                  <div>{player.name}</div>
                  <PlayerDropdownMenu player={player} />
                </div>
              ))}
            </div>
          </div>

          <div className="my-10">
            <div className="flex flex-row">
              <h1 className="font-bold text-2xl mr-auto"> Game Log</h1>
              <Button
                className="my-2"
                onClick={() => router.visit(`/clubs/${club.id}/games/new`)}
              >
                New Game
              </Button>
            </div>
            <GameTable columns={ColumnHeaders} games={games} />
          </div>

          <Link
            href="/clubs"
            className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Back to clubs
          </Link>
          <div className="inline-block ml-2">
            <Link
              href={`/clubs/${club.id}`}
              as="button"
              method="delete"
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium cursor-pointer"
            >
              Destroy this club
            </Link>
            <Link
              href={`/clubs/${club.id}/edit`}
              as="button"
              method="get"
              className="ml-2 mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium cursor-pointer"
            >
              Edit this club
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

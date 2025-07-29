import { Link } from "@inertiajs/react";
import { ClubType } from "./types";
import { GameListItemType } from "../Game/types";
import { Button } from "@/components/ui/button";
import { GameTable, ColumnHeaders } from "./components/GameTable";

interface ShowProps {
  club: ClubType;
  games: GameListItemType[];
  flash: { notice?: string };
}

export default function Show({ club, games, flash }: ShowProps) {
  console.log("Show props:", { club, games, flash });
  return (
    <>
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl"> {club.name}</h1>

          {games.map((game) => (
            <div key={game.id}> {game.formatted_buy_in} </div>
          ))}

          <GameTable columns={ColumnHeaders} games={games} />
          <Button className=""> Hello </Button>
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
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium"
            >
              Destroy this club
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

import { Head, Link } from "@inertiajs/react";
import { Fragment } from "react";
import { PlayerType } from "./types";

interface IndexProps {
  players: PlayerType[];
  flash: { notice?: string };
}

export default function Index({ players, flash }: IndexProps) {
  return (
    <>
      <Head title="Players" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Players</h1>
          <Link
            href="/players/new"
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New player
          </Link>
        </div>

        <div className="min-w-full">
          {players.map((player) => (
            <Fragment key={player.id}>
              <Player player={player} />
              <p>
                <Link
                  href={`/players/${player.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this player
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

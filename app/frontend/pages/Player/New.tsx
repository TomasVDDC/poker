import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerType } from "./types";
import { ClubType } from "../Club/types";
import { GameType } from "../Game/types";

interface NewProps {
  club: ClubType;
  game: GameType;
  player: PlayerType;
}

export default function New({ club, game, player }: NewProps) {
  return (
    <>
      <Head title="New player" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New player</h1>

        <Form
          player={player}
          onSubmit={(form) => {
            form.transform((data) => ({ player: data }));
            form.post(`/clubs/${club.id}/games/${game.id}/players`);
          }}
          submitText="Create Player"
        />

        <Link
          href="/players"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to players
        </Link>
      </div>
    </>
  );
}

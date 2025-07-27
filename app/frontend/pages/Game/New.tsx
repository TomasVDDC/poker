import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { GameType } from "./types";
import { ClubType } from "../Club/types";

interface NewProps {
  club: ClubType;
  game: GameType;
}

export default function New({ club, game }: NewProps) {
  return (
    <>
      <Head title="New game" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New game</h1>

        <Form
          game={game}
          onSubmit={(form) => {
            form.transform((data) => ({ game: data }));
            form.post(`/clubs/${club.id}/games`);
          }}
          submitText="Create Game"
        />

        <Link
          href="/games"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to games
        </Link>
      </div>
    </>
  );
}

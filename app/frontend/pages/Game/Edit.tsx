import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { GameType } from "./types";
import { format } from "date-fns";

interface EditProps {
  game: GameType;
}

export default function Edit({ game }: EditProps) {
  return (
    <>
      <Head title="Editing game" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing game</h1>

        <Form
          game={game}
          onSubmit={(form) => {
            form.transform((data) => ({
              game: { buy_in: data.buy_in, date: format(data.date, "PPP") },
            }));
            form.patch(`/clubs/${game.club_id}/games/${game.id}`);
          }}
          submitText="Update Game"
        />
      </div>
    </>
  );
}

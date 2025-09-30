import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerType } from "./types";
import { ClubType } from "../Club/types";

interface EditProps {
  player: PlayerType;
  club: ClubType;
}

export default function Edit({ player, club }: EditProps) {
  return (
    <>
      <Head title="Editing player" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing player</h1>

        <Form
          player={player}
          onSubmit={(form) => {
            form.transform((data) => ({ player: { name: data.name.trim() } }));
            form.patch(`/clubs/${player.club_id}/players/${player.id}`);
          }}
          submitText="Update Player"
        />

        <Link
          href={`/clubs/${club.id}/`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to club
        </Link>
      </div>
    </>
  );
}

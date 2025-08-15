import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { ClubType } from "./types";
import { PlayerType } from "../Player/types";
import { PlayerDropdownMenu } from "./components/PlayerDropdownMenu";

interface EditProps {
  club: ClubType;
  players: PlayerType[];
}

export default function Edit({ club, players }: EditProps) {
  return (
    <>
      <Head title="Editing club" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing club</h1>
        <h1 className="font-bold text-2xl my-2 mr-auto"> Players </h1>
        <div className="flex flex-row">
          <div className="flex flex-row gap-3">
            {players.map((player) => (
              <div className="flex items-center">
                <div>{player.name}</div>
                <PlayerDropdownMenu player={player} />
              </div>
            ))}
          </div>
        </div>

        <Form
          club={club}
          onSubmit={(form) => {
            form.transform((data) => ({
              club: data,
            }));
            form.patch(`/clubs/${club.id}`);
          }}
          submitText="Update Club"
        />

        <Link
          href={`/clubs/${club.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to club
        </Link>
      </div>
    </>
  );
}

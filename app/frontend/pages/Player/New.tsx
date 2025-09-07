import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerType } from "./types";
import { ClubType } from "../Club/types";

interface NewProps {
  club: ClubType;
  player: PlayerType;
  players: PlayerType[];
  redirect_to: string;
}

export default function New({ club, players, player, redirect_to }: NewProps) {
  console.log("Props:", { club, players, player, redirect_to });
  return (
    <>
      <Head title="New player" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Add players</h1>

        <h1 className="font-bold text-2xl my-2 mr-auto"> Players </h1>

        <div className="flex flex-row">
          <div className="flex flex-row gap-3">
            {players.map((player) => (
              <div className="flex items-center">
                <div>{player.name}</div>
              </div>
            ))}
          </div>
        </div>
        <Form
          player={player}
          onSubmit={(form) => {
            form.transform((data) => ({
              // trim() removes whitespace from both sides of the string
              player: { name: data.name.trim() },
              redirect_to: redirect_to,
            }));
            form.post(`/clubs/${club.id}/players`);
            // reset the form, not sure why form.reset() is not working
            form.setData({
              name: player.name,
            });
          }}
          submitText="Create Player"
        />

        <Link
          href={redirect_to ? redirect_to : `/clubs/${club.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Done
        </Link>
      </div>
    </>
  );
}

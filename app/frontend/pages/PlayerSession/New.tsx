import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerSessionType } from "./types";
import { PlayerType } from "../Player/types";
import { ClubType } from "../Club/types";
import { GameType } from "../Game/types";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface NewProps {
  club: ClubType;
  game: GameType;
  player_session: PlayerSessionType;
  players: PlayerType[];
}

export default function New({ club, game, player_session, players }: NewProps) {
  console.log("Show props:", { club, game, player_session, players });
  let player_id = -1;
  return (
    <>
      <Head title="New player session" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New player session</h1>
        <h2 className="text-2xl mt-4">Choose a player</h2>
        <ToggleGroup className="w-auto mt-4" type="single">
          {players.map((player) => (
            <ToggleGroupItem
              onClick={() => (player_id = player.id)}
              value={player.name}
            >
              {player.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Form
          player_session={player_session}
          onSubmit={(form) => {
            form.transform((data) => ({
              player_session: data,
              player_id: player_id,
            }));
            form.post(`/clubs/${club.id}/games/${game.id}/player_sessions/`);
          }}
          submitText="Create Player Session"
        />

        <Link
          href="/player_sessions"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to player sessions
        </Link>
      </div>
    </>
  );
}

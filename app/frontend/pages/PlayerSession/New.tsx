import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
  const [playerId, setPlayerId] = useState<number>(players[0]?.id || 0);
  useEffect(() => {
    setPlayerId(players[0]?.id || 0);
  }, [players]);

  console.log("Show props:", { club, game, player_session, players });
  console.log("Show state:", { playerId });

  return (
    <>
      <Head title="New player session" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New player session</h1>
        <div className="flex flex-row gap-4 items-center mt-6">
          <h2 className="text-2xl mr-auto ">Choose a player</h2>
          <Button
            className="mr-2 bg-blue-600 hover:bg-blue-600 cursor-pointer"
            onClick={() =>
              router.visit(`/clubs/${club.id}/players/new`, {
                data: { redirect_to: window.location.pathname },
              })
            }
          >
            New Player
          </Button>
        </div>
        <ToggleGroup
          className="w-auto mt-4"
          value={String(playerId)}
          type="single"
        >
          {players.map((player) => (
            <ToggleGroupItem
              onClick={() => setPlayerId(player.id)}
              value={String(player.id)}
              className="data-[state=on]:text-white data-[state=on]:bg-blue-500"
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
              player_id: playerId,
            }));
            form.post(`/clubs/${club.id}/games/${game.id}/player_sessions/`);
          }}
          submitText="Create Player Session"
        />

        <Button
          variant={"secondary"}
          className="rounded-sm ml-3 py-6 px-5 text-md cursor-pointer"
          onClick={() => router.visit(`/clubs/${club.id}/games/${game.id}`)}
        >
          Back to Game
        </Button>
      </div>
    </>
  );
}

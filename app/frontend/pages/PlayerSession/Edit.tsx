import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerSessionType } from "./types";
import { ClubType } from "../Club/types";

interface EditProps {
  club: ClubType;
  player_session: PlayerSessionType;
}

export default function Edit({ club, player_session }: EditProps) {
  return (
    <>
      <Head title="Editing player session" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing player session</h1>

        <Form
          player_session={player_session}
          onSubmit={(form) => {
            form.transform((data) => ({
              player_session: data,
            }));
            form.patch(
              `/clubs/${club.id}/games/${player_session.game_id}/player_sessions/${player_session.id}`,
            );
          }}
          submitText="Create Player Session"
        />

        <Link
          href={`/player_sessions/${player_session.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Show this player session
        </Link>
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

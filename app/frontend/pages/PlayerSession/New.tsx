import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { PlayerSessionType } from "./types";
import { PlayerType } from "../Player/types";

interface NewProps {
  player_session: PlayerSessionType;
  players: PlayerType[];
}

export default function New({ player_session, players }: NewProps) {
  console.log("Show props:", { player_session, players });
  return (
    <>
      <Head title="New player session" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New player session</h1>

        <Form
          player_session={player_session}
          onSubmit={(form) => {
            form.transform((data) => ({ player_session: data }));
            form.post("/player_sessions");
          }}
          submitText="Create Player session"
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

import { Head, Link } from "@inertiajs/react";
import Form from "./Form";
import { ClubType } from "./types";
import { PlayerType } from "@/pages/Player/types";

interface NewProps {
  club: ClubType;
  players: PlayerType[];
}

export default function New({ club }: NewProps) {
  return (
    <>
      <Head title="New club" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New club</h1>

        <Form
          club={club}
          onSubmit={(form) => {
            form.transform((data) => ({ club: data }));
            form.post("/clubs");
          }}
          submitText="Create Club"
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

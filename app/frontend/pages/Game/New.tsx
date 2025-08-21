import { Head, router } from "@inertiajs/react";
import Form from "./Form";
import { GameType } from "./types";
import { ClubType } from "../Club/types";
import { Button } from "@/components/ui/button";

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
            console.log("form", form);
            form.transform((data) => ({ game: data }));
            form.post(`/clubs/${club.id}/games`);
          }}
          submitText="Create Game"
        />

        <Button
          variant={"secondary"}
          className="rounded-sm ml-3 py-6 px-5 text-base cursor-pointer"
          onClick={() => router.visit(`/clubs/${club.id}/`)}
        >
          Back to Club
        </Button>
      </div>
    </>
  );
}

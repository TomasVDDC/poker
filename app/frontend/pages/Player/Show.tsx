import { Head, Link, router } from "@inertiajs/react";
import { PlayerType } from "./types";
import { ClubType } from "../Club/types";
import { Button } from "@/components/ui/button";
import { Chart } from "@/pages/Player/components/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ShowProps {
  player: PlayerType;
  club: ClubType;
  flash: { notice?: string };
}

// const chart_data = [
//   { date: "January", Emilio: 186 },
//   { date: "February", Emilio: 305 },
//   { date: "March", Emilio: 237 },
//   { date: "April", Emilio: 73 },
//   { date: "May", Emilio: 209 },
//   { date: "June", Emilio: 214 },
// ];

export default function Show({
  player,
  club,
  chart_data,
  stats,
  flash,
}: ShowProps) {
  console.log("Show props:", {
    club,
    player,
    chart_data,
    stats,
    flash,
  });

  return (
    <>
      <Head title={`Player #${player.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">{player.name}</h1>

          <div className="mt-5">
            <p>Number of games played: {stats.number_of_games}</p>
            <p>Biggest win: {stats.biggest_win}</p>
            <p>Biggest loss: {stats.biggest_loss}</p>
          </div>

          <Chart data={chart_data} players={[player]} />

          <Button
            onClick={() => router.get(`/clubs/${club.id}`)}
            className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
          >
            Back to club
          </Button>
          {/*<Button
            onClick={() =>
              router.get(`/clubs/${club.id}/players/${player.id}/edit`)
            }
            className="ml-2 mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer"
          >
            Edit this player
          </Button>
          <div className="inline-block ml-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="mt-2 text-gray-700 hover:bg-gray-100 rounded-lg py-3 px-5 bg-gray-100 sm:text-base text-sm cursor-pointer">
                  Destroy this player
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the player and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      router.delete(`/clubs/${club.id}/players/${player.id}`)
                    }
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>{" "}
          </div>*/}
        </div>
      </div>
    </>
  );
}

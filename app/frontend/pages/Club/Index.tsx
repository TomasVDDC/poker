import { Head, Link, router } from "@inertiajs/react";
import { Fragment } from "react";
import { ClubType } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface IndexProps {
  clubs: ClubType[];
  flash: { notice?: string };
}

export default function Index({ clubs, flash }: IndexProps) {
  return (
    <>
      <Head title="Clubs" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Clubs</h1>
          <Link
            href="/clubs/new"
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New club
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {clubs.map((club) => (
            <Fragment key={club.id}>
              <Card
                onClick={() => router.visit(`/clubs/${club.id}`)}
                className="shadow-md hover:shadow-lg transition rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {club.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Discover more about this club.
                  </p>
                </CardContent>
              </Card>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

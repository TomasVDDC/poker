import { Head, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import Club from './Club'
import { ClubType } from './types'

interface IndexProps {
  clubs: ClubType[]
  flash: { notice?: string }
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

        <div className="min-w-full">
          {clubs.map((club) => (
            <Fragment key={club.id}>
              <Club club={club} />
              <p>
                <Link
                  href={`/clubs/${club.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this club
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

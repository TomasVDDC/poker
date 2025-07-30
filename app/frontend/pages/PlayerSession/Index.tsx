import { Head, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import PlayerSession from './PlayerSession'
import { PlayerSessionType } from './types'

interface IndexProps {
  player_sessions: PlayerSessionType[]
  flash: { notice?: string }
}

export default function Index({ player_sessions, flash }: IndexProps) {
  return (
    <>
      <Head title="Player sessions" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Player sessions</h1>
          <Link
            href="/player_sessions/new"
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New player session
          </Link>
        </div>

        <div className="min-w-full">
          {player_sessions.map((player_session) => (
            <Fragment key={player_session.id}>
              <PlayerSession player_session={player_session} />
              <p>
                <Link
                  href={`/player_sessions/${player_session.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this player session
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

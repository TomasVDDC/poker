import { Head, Link } from '@inertiajs/react'
import PlayerSession from './PlayerSession'
import { PlayerSessionType } from './types'

interface ShowProps {
  player_session: PlayerSessionType
  flash: { notice?: string }
}

export default function Show({ player_session, flash }: ShowProps) {
  return (
    <>
      <Head title={`Player session #${player_session.id}`} />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <div className="mx-auto">
          {flash.notice && (
            <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
              {flash.notice}
            </p>
          )}

          <h1 className="font-bold text-4xl">Player session #{player_session.id}</h1>

          <PlayerSession player_session={player_session} />

          <Link
            href={`/player_sessions/${player_session.id}/edit`}
            className="mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Edit this player session
          </Link>
          <Link
            href="/player_sessions"
            className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Back to player sessions
          </Link>
          <div className="inline-block ml-2">
            <Link
              href={`/player_sessions/${player_session.id}`}
              as="button"
              method="delete"
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium"
            >
              Destroy this player session
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

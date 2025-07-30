import { Head, Link } from '@inertiajs/react'
import Player from './Player'
import { PlayerType } from './types'

interface ShowProps {
  player: PlayerType
  flash: { notice?: string }
}

export default function Show({ player, flash }: ShowProps) {
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

          <h1 className="font-bold text-4xl">Player #{player.id}</h1>

          <Player player={player} />

          <Link
            href={`/players/${player.id}/edit`}
            className="mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Edit this player
          </Link>
          <Link
            href="/players"
            className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
          >
            Back to players
          </Link>
          <div className="inline-block ml-2">
            <Link
              href={`/players/${player.id}`}
              as="button"
              method="delete"
              className="mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium"
            >
              Destroy this player
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

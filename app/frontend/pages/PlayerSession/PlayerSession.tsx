import { PlayerSessionType } from './types'

interface PlayerSessionProps {
  player_session: PlayerSessionType
}

export default function PlayerSession({ player_session }: PlayerSessionProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Bought in for:</strong>
        {player_session.amount_in?.toString()}
      </p>
      <p className="my-5">
        <strong className="block font-medium mb-1">Cashed out for:</strong>
        {player_session.amount_out?.toString()}
      </p>
    </div>
  )
}

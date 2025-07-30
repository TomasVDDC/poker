import { PlayerSessionType } from './types'

interface PlayerSessionProps {
  player_session: PlayerSessionType
}

export default function PlayerSession({ player_session }: PlayerSessionProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Number of buy ins:</strong>
        {player_session.number_of_buy_ins?.toString()}
      </p>
      <p className="my-5">
        <strong className="block font-medium mb-1">Winnings:</strong>
        {player_session.winnings?.toString()}
      </p>
    </div>
  )
}

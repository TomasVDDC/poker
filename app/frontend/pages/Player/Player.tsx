import { PlayerType } from './types'

interface PlayerProps {
  player: PlayerType
}

export default function Player({ player }: PlayerProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Name:</strong>
        {player.name?.toString()}
      </p>
    </div>
  )
}

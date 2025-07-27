import { GameType } from './types'

interface GameProps {
  game: GameType
}

export default function Game({ game }: GameProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Buy in:</strong>
        {game.buy_in?.toString()}
      </p>
    </div>
  )
}

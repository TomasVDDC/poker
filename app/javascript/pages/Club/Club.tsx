import { ClubType } from './types'

interface ClubProps {
  club: ClubType
}

export default function Club({ club }: ClubProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">Name:</strong>
        {club.name?.toString()}
      </p>
    </div>
  )
}

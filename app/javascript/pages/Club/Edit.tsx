import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { ClubType } from './types'

interface EditProps {
  club: ClubType
}

export default function Edit({ club }: EditProps) {
  return (
    <>
      <Head title="Editing club" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Editing club</h1>

        <Form
          club={club}
          onSubmit={(form) => {
            form.transform((data) => ({ club: data }))
            form.patch(`/clubs/${club.id}`)
          }}
          submitText="Update Club"
        />

        <Link
          href={`/clubs/${club.id}`}
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Show this club
        </Link>
        <Link
          href="/clubs"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to clubs
        </Link>
      </div>
    </>
  )
}

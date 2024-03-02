import { redirect } from 'next/navigation'

const RoomPage = ({ params }: { params: { room_id: string } }) => {
  redirect(`/${params.room_id}/contents`)
}

export default RoomPage

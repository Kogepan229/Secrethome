import { UpdateRoomForm } from 'features/room_admin/components/UpdateRoomForm'
import { getRoomData } from 'features/rooms/utils'

const Page = async ({ params }: { params: { room_id: string } }) => {
  const roomData = await getRoomData(params.room_id)

  return <UpdateRoomForm roomData={roomData} />
}

export default Page

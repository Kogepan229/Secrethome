import { getRoomData } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoUpdatePage from 'features/room_video/components/pages/admin_update'

const ContentsPage = async ({ params }: { params: { room_id: string; content_id: string } }) => {
  const roomData = await getRoomData(params.room_id)

  const content = () => {
    switch (roomData.roomType) {
      case RoomType.Video:
        return <VideoUpdatePage roomName={roomData.name} roomId={params.room_id} contentId={params.content_id} />
      default:
        return null
    }
  }

  return <>{content()}</>
}

export default ContentsPage

import { SearchParams } from 'types/SearchParams'
import { getRoomData } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoContent from 'features/room_video/components/pages/content'

const ContentsPage = async ({ params, searchParams }: { params: { room_id: string; content_id: string }; searchParams: SearchParams }) => {
  const roomData = await getRoomData(params.room_id)

  const content = () => {
    switch (roomData.roomType) {
      case RoomType.Video:
        return <VideoContent roomName={roomData.name} roomId={params.room_id} contentId={params.content_id} />
      default:
        return null
    }
  }

  return <>{content()}</>
}

export default ContentsPage

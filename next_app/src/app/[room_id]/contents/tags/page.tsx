import { SearchParams } from 'types/SearchParams'
import { getRoomData } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoContentsWithTag from 'features/room_video/components/pages/tags'

const ContentsPage = async ({ params, searchParams }: { params: { room_id: string }; searchParams: SearchParams }) => {
  const roomData = await getRoomData(params.room_id)

  const content = () => {
    switch (roomData.roomType) {
      case RoomType.Video:
        return <VideoContentsWithTag roomName={roomData.name} roomId={params.room_id} searchParams={searchParams} />
      default:
        return null
    }
  }

  return <>{content()}</>
}

export default ContentsPage

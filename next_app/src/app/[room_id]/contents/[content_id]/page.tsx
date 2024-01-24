import { SearchParams } from 'types/SearchParams'
import { getRoomType } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoContent from 'features/room_video/components/pages/content'

const ContentsPage = async ({ params, searchParams }: { params: { room_id: string; content_id: string }; searchParams: SearchParams }) => {
  const roomType = await getRoomType(params.room_id)

  const content = () => {
    switch (roomType) {
      case RoomType.Video:
        return <VideoContent roomId={params.room_id} contentId={params.content_id} />
      default:
        return null
    }
  }

  return <>{content()}</>
}

export default ContentsPage

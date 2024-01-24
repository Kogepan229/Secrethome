import { SearchParams } from 'types/SearchParams'
import { getRoomType } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoContentsWithTag from 'features/room_video/components/pages/tags'

const ContentsPage = async ({ params, searchParams }: { params: { room_id: string }; searchParams: SearchParams }) => {
  const roomType = await getRoomType(params.room_id)

  const content = () => {
    switch (roomType) {
      case RoomType.Video:
        return <VideoContentsWithTag roomId={params.room_id} searchParams={searchParams} />
      default:
        return null
    }
  }

  return <>{content()}</>
}

export default ContentsPage

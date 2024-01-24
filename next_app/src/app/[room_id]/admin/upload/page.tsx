import { getRoomType } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import VideoUploadPage from 'features/room_video/components/pages/admin_upload'

const ContentsPage = async ({ params }: { params: { room_id: string } }) => {
  const roomType = await getRoomType(params.room_id)

  const page = () => {
    switch (roomType) {
      case RoomType.Video:
        return <VideoUploadPage roomId={params.room_id} />
      default:
        return null
    }
  }

  return <>{page()}</>
}

export default ContentsPage

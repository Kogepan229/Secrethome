import css from './contents.module.scss'
import { SearchParams } from 'types/SearchParams'
import VideoContentsList from 'features/room_video/components/ContentsList'
import { Suspense } from 'react'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import PageSelector from 'components/PageSelector'
import { getCurrentPageIndex, getTotalContentsPageNum } from 'features/room_video/utils'
import { getRoomType } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'
import { redirect } from 'next/navigation'

const ContentsPage = async ({ params, searchParams }: { params: { room_id: string }; searchParams: SearchParams }) => {
  const roomType = await getRoomType(params.room_id)
  const totalPageNum = await getTotalContentsPageNum(params.room_id)
  const currentPageIndex = getCurrentPageIndex(searchParams)

  const contentsList = () => {
    switch (roomType) {
      case RoomType.Video:
        return <VideoContentsList roomId={params.room_id} searchParams={searchParams}></VideoContentsList>
      default:
        redirect('/')
    }
  }

  return (
    <SecretRoomLayout roomId={params.room_id}>
      <div className={css.contents_main}>
        <PageSelector baseURL={`/${params.room_id}/contents`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        <Suspense fallback={null}>
          {contentsList()}
          <PageSelector baseURL={`/${params.room_id}/contents`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        </Suspense>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentsPage

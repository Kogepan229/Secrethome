import css from './tags.module.scss'
import { SearchParams } from 'types/SearchParams'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import ContentPost from 'features/room_video/components/ContentPost'
import PageSelector from 'components/PageSelector'
import { getContentsDataWithTags, getCurrentPageIndex, getTotalContentsPageNumWithTag } from 'features/room_video/utils'
import { ContentData } from 'features/room_video/types'
import { getTagName } from 'features/tags/tags'
import { ContentsGridHeader } from 'components/ContentsGridHeader'

const Contents = async ({
  searchParams,
  roomId,
}: {
  searchParams: SearchParams
  roomId: string
}): Promise<[JSX.Element[], string, string, number, number]> => {
  if (searchParams == undefined || searchParams.tags == undefined || typeof searchParams.tags != 'string') {
    const msg = (
      <p className={css.no_content_message} key="only one">
        コンテンツがありません
      </p>
    )
    return [[msg], '', '', 0, 0]
  }

  const tagID = searchParams.tags
  const totalPageNum = await getTotalContentsPageNumWithTag(tagID)
  const currentPageIndex = getCurrentPageIndex(searchParams)
  const tagName = await getTagName(tagID)
  const contentsData: ContentData[] = await getContentsDataWithTags(tagID, currentPageIndex)

  if (contentsData.length == 0) {
    const msg = (
      <p className={css.no_content_message} key="only one">
        コンテンツがありません
      </p>
    )
    return [[msg], '', '', 0, 0]
  }

  const contents = contentsData.map(content => {
    return <ContentPost roomId={roomId} contentData={content} key={content.id}></ContentPost>
  })

  return [contents, tagID, tagName, totalPageNum, currentPageIndex]
}

const TagsPage = async ({ roomName, roomId, searchParams }: { roomName: string; roomId: string; searchParams: SearchParams }) => {
  const [contents, tagID, tagName, totalPageNum, currentPageIndex] = await Contents({ roomId, searchParams })

  return (
    <SecretRoomLayout roomName={roomName} roomId={roomId}>
      <div className={css.contents_main}>
        <ContentsGridHeader title={tagName} />
        <PageSelector baseURL={`/${roomId}/contents/tags?tags=${tagID}`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        {contents}
        <PageSelector baseURL={`/${roomId}/contents/tags?tags=${tagID}`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
      </div>
    </SecretRoomLayout>
  )
}

export default TagsPage

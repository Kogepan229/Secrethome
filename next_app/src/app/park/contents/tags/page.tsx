import css from './tags.module.scss'
import { SearchParams } from 'types/SearchParams'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import ContentPost from 'features/contents/components/ContentPost'
import PageSelector from 'features/contents/components/PageSelector'
import { getContentsDataWithTags, getCurrentPageIndex, getTotalContentsPageNumWithTag } from 'features/contents/util'
import { ContentData } from 'features/contents/types'
import { getTagName } from 'util/secret/park/tags'

const Contents = async (searchParams: SearchParams): Promise<[JSX.Element[], string, string, number, number]> => {
  if (searchParams == undefined || searchParams.tags == undefined || typeof searchParams.tags != 'string') {
    return [[<p className={css.no_content_message}>コンテンツがありません</p>], '', '', 0, 0]
  }

  const tagID = searchParams.tags
  const totalPageNum = await getTotalContentsPageNumWithTag(tagID)
  const currentPageIndex = getCurrentPageIndex(searchParams)
  const tagName = await getTagName(tagID)
  const contentsData: ContentData[] = await getContentsDataWithTags(tagID, currentPageIndex)

  if (contentsData.length == 0) {
    return [[<p className={css.no_content_message}>コンテンツがありません</p>], '', '', 0, 0]
  }

  const contents = contentsData.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })

  return [contents, tagID, tagName, totalPageNum, currentPageIndex]
}

const TagsPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const [contents, tagID, tagName, totalPageNum, currentPageIndex] = await Contents(searchParams)

  return (
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <h3 className={css.tag_header}>{tagName}</h3>
        <PageSelector baseURL={`/park/contents/tags?tags=${tagID}`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        {contents}
        <PageSelector baseURL={`/park/contents/tags?tags=${tagID}`} totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
      </div>
    </SecretRoomLayout>
  )
}

export default TagsPage

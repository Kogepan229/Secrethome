import css from './tags.module.scss'
import { SearchParams } from 'types/SearchParams'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import ContentPost from 'features/contents/components/ContentPost'
import PageSelector from 'features/contents/components/PageSelector'
import { getContentsDataWithTags, getCurrentPageIndex, getTotalContentsPageNumWithTag } from 'features/contents/util'
import { ContentData } from 'features/contents/types'
import { getTagName } from 'util/secret/park/tags'

const TagsPage = async ({ searchParams }: { searchParams?: SearchParams }) => {
  let contentsData: ContentData[]
  let tagName = ''
  let totalPageNum = 0

  const currentPageIndex = getCurrentPageIndex(searchParams!)

  if (searchParams == undefined || searchParams.tags == undefined) {
    contentsData = []
  } else if (typeof searchParams.tags == 'string') {
    contentsData = await getContentsDataWithTags([searchParams.tags], currentPageIndex)
    tagName = await getTagName(searchParams.tags)
    totalPageNum = await getTotalContentsPageNumWithTag(searchParams.tags)
  } else {
    contentsData = await getContentsDataWithTags(searchParams.tags, currentPageIndex)
  }

  const Contents = contentsData.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })

  return (
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <h3 className={css.tag_header}>{tagName}</h3>
        <PageSelector baseURL={`/park/contents/tags?tags=${searchParams?.tags}`} searchParams={searchParams} totalPageNum={totalPageNum} />
        {Contents}
        <PageSelector baseURL={`/park/contents/tags?tags=${searchParams?.tags}`} searchParams={searchParams} totalPageNum={totalPageNum} />
      </div>
    </SecretRoomLayout>
  )
}

export default TagsPage

import css from './tags.module.scss'
import { SearchParams } from 'types/SearchParams'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import PageSelector from 'features/contents/components/PageSelector'
import { getContentsDataWithTags } from 'features/contents/util'
import { ContentData } from 'features/contents/types'
import ContentPost from 'features/contents/components/ContentPost'
import { CONTENTS_NUM_PER_PAGE } from 'features/contents/const'
import { getTagName } from 'util/secret/park/tags'

const TagsPage = async ({ searchParams }: { searchParams?: SearchParams }) => {
  let contentsData: ContentData[]
  let tagName = ''
  if (searchParams == undefined || searchParams.tags == undefined) {
    contentsData = []
  } else if (typeof searchParams.tags == 'string') {
    contentsData = await getContentsDataWithTags([searchParams.tags])
    tagName = await getTagName(searchParams.tags)
  } else {
    contentsData = await getContentsDataWithTags(searchParams.tags)
  }

  const Contents = contentsData.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })

  return (
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <h3 className={css.tag_header}>{tagName}</h3>
        <PageSelector searchParams={searchParams} totalPageNum={Math.ceil(contentsData.length / CONTENTS_NUM_PER_PAGE)} />
        {Contents}
        <PageSelector searchParams={searchParams} totalPageNum={Math.ceil(contentsData.length / CONTENTS_NUM_PER_PAGE)} />
      </div>
    </SecretRoomLayout>
  )
}

export default TagsPage

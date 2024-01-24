import css from './contents.module.scss'
import { SearchParams } from 'types/SearchParams'
import ContentsList from 'features/contents/components/ContentsList'
import { Suspense } from 'react'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import PageSelector from 'features/contents/components/PageSelector'
import { getCurrentPageIndex, getTotalContentsPageNum } from 'features/contents/util'

const ContentsPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const totalPageNum = await getTotalContentsPageNum()
  const currentPageIndex = getCurrentPageIndex(searchParams)

  return (
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <PageSelector baseURL="/park/contents" totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        <Suspense fallback={null}>
          <ContentsList searchParams={searchParams}></ContentsList>
          <PageSelector baseURL="/park/contents" totalPageNum={totalPageNum} currentPageIndex={currentPageIndex} />
        </Suspense>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentsPage

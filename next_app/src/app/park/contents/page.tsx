import css from './contents.module.scss'
import { SearchParams } from 'types/SearchParams'
import ContentsList from 'features/contents/components/ContentsList'
import { Suspense } from 'react'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import PageSelector from 'features/contents/components/PageSelector'

const ContentsPage = ({ searchParams }: { searchParams?: SearchParams }) => {
  return (
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <PageSelector baseURL="/park/contents" searchParams={searchParams} />
        <Suspense fallback={null}>
          <ContentsList searchParams={searchParams}></ContentsList>
          <PageSelector baseURL="/park/contents" searchParams={searchParams} />
        </Suspense>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentsPage

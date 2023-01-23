import css from './contents.module.scss'
import { SearchParams } from 'types/SearchParams'
import ContentsList from 'features/contents/components/ContentsList'
import { Suspense } from 'react'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import PageSelector from 'features/contents/components/PageSelector'

const ContentsPage = ({ searchParams }: { searchParams?: SearchParams }) => {
  return (
    /* @ts-expect-error Server Component */
    <SecretRoomLayout>
      <div className={css.contents_main}>
        {/* @ts-expect-error Server Component */}
        <PageSelector searchParams={searchParams} />
        <Suspense fallback={null}>
          {/* @ts-expect-error Server Component */}
          <ContentsList searchParams={searchParams}></ContentsList>
        </Suspense>
        {/* @ts-expect-error Server Component */}
        <PageSelector searchParams={searchParams} />
      </div>
    </SecretRoomLayout>
  )
}

export default ContentsPage

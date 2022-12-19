import css from "./contents.module.scss"
import { SearchParams } from "types/SearchParams"
import ContentsList from 'features/contents/components/ContentsList';
import { Suspense } from 'react';
import SecretRoomLayout from 'components/layout/SecretRoomLayout';


const ContentsPage = ({ searchParams }: {searchParams?: SearchParams}) => {
  return(
    /* @ts-expect-error Server Component */
    <SecretRoomLayout>
      <div className={css.contents_main}>
        <Suspense fallback={null}>
          {/* @ts-expect-error Server Component */}
          <ContentsList searchParams={searchParams}></ContentsList>
        </Suspense>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentsPage
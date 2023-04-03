import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { DB } from 'util/sql'
import Link from 'next/link'
import { getContentTagsData, TagData } from 'util/secret/park/tags'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import css from './content.module.scss'

const VideoPlayer = dynamic(() => import('components/VideoPlayer/VideoPlayer'), { ssr: false, suspense: true })

type ContentData = {
  id?: string
  title?: string
  description?: string
  tags: TagData[]
}

const getContentData = async (contentID: any) => {
  let data: ContentData = { tags: [] }

  let result = await DB.query<any[]>(`select title, description from park_contents where id='${contentID}'`)
  if (result.length > 0) {
    data.id = contentID as string
    data.title = result[0].title
    data.description = result[0].description
    data.tags = await getContentTagsData(contentID as string)
  }
  return data
}

const ContentPage = async ({ params }: { params: any }) => {
  const contentData = await getContentData(params.content_id)
  if (contentData.id == undefined) {
    return <p>No content</p>
  }

  return (
    /* @ts-expect-error Server Component */
    <SecretRoomLayout>
      <div className={css.content_container}>
        <div className={css.video_container}>
          <Suspense fallback={null}>
            <VideoPlayer src={process.env.NEXT_PUBLIC_FILESERVER_URL + '/contents/' + contentData.id + '/' + contentData.id + '.m3u8'} />
          </Suspense>
        </div>
        <p className={css.title}>{contentData.title}</p>
        <p className={css.description}>{contentData.description}</p>
        <Link href={`/park/admin/update/${contentData.id}`}>更新</Link>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentPage

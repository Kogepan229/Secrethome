import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getDBConnection } from 'utils/sql'
import Link from 'next/link'
import { getContentTagsData, TagData } from 'features/tags/tags'
import SecretRoomLayout from 'components/layout/SecretRoomLayout'
import css from './content.module.scss'
import reactStringReplace from 'react-string-replace'
import SimpleButton from 'components/SimpleButton'

const VideoPlayerHls = dynamic(() => import('components/VideoPlayer/VideoPlayerHls'), { ssr: false, suspense: true })

type ContentData = {
  id?: string
  title?: string
  description?: string
  tags: TagData[]
}

const getContentData = async (contentID: any) => {
  let contentData: ContentData = { tags: [] }

  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT title, description FROM contents where id=?`, [contentID])
  con.end()
  const data = JSON.parse(JSON.stringify(rows)) as any[]
  if (data.length > 0) {
    contentData.id = contentID as string
    contentData.title = data[0].title
    contentData.description = data[0].description
    contentData.tags = await getContentTagsData(contentID as string)
  }
  return contentData
}

const ContentPage = async ({ roomName, roomId, contentId }: { roomName: string; roomId: string; contentId: string }) => {
  const contentData = await getContentData(contentId)
  if (contentData.id == undefined) {
    return <p>No content</p>
  }
  const description = reactStringReplace(contentData.description, /(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)/g, (match, i) => (
    <a key={i} href={match} target="_blank" rel="noopener noreferrer">
      {match}
    </a>
  ))

  return (
    <SecretRoomLayout roomName={roomName} roomId={roomId}>
      <div className={css.content_container}>
        <div className={css.video_container}>
          <Suspense fallback={null}>
            <VideoPlayerHls
              src={process.env.NEXT_PUBLIC_FILESERVER_URL + '/video/contents/' + contentData.id + '/' + contentData.id + '.m3u8'}
            />
          </Suspense>
        </div>
        <div className={css.under_video}>
          <p className={css.title}>{contentData.title}</p>
          <SimpleButton className={css.button_update}>
            <Link href={`/${roomId}/admin/update/${contentData.id}`}>更新</Link>
          </SimpleButton>
        </div>
        <p className={css.description}>{description}</p>
      </div>
    </SecretRoomLayout>
  )
}

export default ContentPage

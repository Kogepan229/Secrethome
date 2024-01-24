import css from './ContentsList.module.scss'
import { getDBConnection } from 'utils/sql'
import { SearchParams } from 'types/SearchParams'
import { CONTENTS_NUM_PER_PAGE } from 'features/room_video/const'
import { ContentData } from 'features/room_video/types'
import ContentPost from './ContentPost'
import { getCurrentPageIndex } from '../utils'
import { getContentTagsData } from 'features/tags/tags'

const getContentsData = async (roomId: string, currentPageIndex: number) => {
  let contentsData: ContentData[] = []

  // Get contents data from DB
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT id, title, description, updated_at FROM contents WHERE room_id=? LIMIT ?, ?`, [
    roomId,
    (currentPageIndex - 1) * CONTENTS_NUM_PER_PAGE,
    CONTENTS_NUM_PER_PAGE,
  ])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  for (let i = 0; i < data.length; i++) {
    let tags = await getContentTagsData(data[i].id)
    contentsData[i] = {
      id: data[i].id,
      title: data[i].title,
      description: data[i].description,
      tags: tags,
      updated_at: data[i].updated_at,
    }
  }
  return contentsData
}

const ContentsList = async ({ roomId, searchParams }: { roomId: string; searchParams?: SearchParams }) => {
  const contentsData = await getContentsData(roomId, getCurrentPageIndex(searchParams!))
  const contents = contentsData.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })

  if (contents.length == 0) {
    return <p className={css.no_content_message}>コンテンツがありません</p>
  }

  return <>{contents}</>
}

export default ContentsList

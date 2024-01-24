import css from './ContentsList.module.scss'
import { getDBConnection } from 'util/sql'
import { SearchParams } from 'types/SearchParams'
import { getContentTagsData } from 'util/secret/park/tags'
import { CONTENTS_NUM_PER_PAGE } from 'features/contents/const'
import { ContentData } from 'features/contents/types'
import ContentPost from 'features/contents/components/ContentPost'
import { getCurrentPageIndex } from '../util'

const getContentsData = async (currentPageIndex: number) => {
  let contentsData: ContentData[] = []

  // Get contents data from DB
  const con = await getDBConnection()
  const [rows, _] = await con.query(`select id, title, description, updated_at from park_contents limit ?, ?`, [
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

const ContentsList = async ({ searchParams }: { searchParams?: SearchParams }) => {
  const contentsData = await getContentsData(getCurrentPageIndex(searchParams!))
  const contents = contentsData.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })

  if (contents.length == 0) {
    return <p className={css.no_content_message}>コンテンツがありません</p>
  }

  return <>{contents}</>
}

export default ContentsList

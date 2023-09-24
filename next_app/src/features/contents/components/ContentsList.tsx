import { getDBConnection } from 'util/sql'
import { SearchParams } from 'types/SearchParams'
import { getContentTagsData } from 'util/secret/park/tags'
import { CONTENTS_NUM_PER_PAGE } from 'features/contents/const'
import { ContentData, ContentsPageData } from 'features/contents/types'
import ContentPost from 'features/contents/components/ContentPost'

const getContentsData = async (searchParams?: SearchParams) => {
  let contentsData: ContentsPageData = { pageNum: 0, contents: [] }
  contentsData.pageNum = Number(searchParams?.page)
  contentsData.pageNum = Number.isNaN(contentsData.pageNum) || contentsData.pageNum <= 0 ? 0 : contentsData.pageNum - 1

  // Get contents data from DB
  const con = await getDBConnection()
  const [rows, _] = await con.query(`select id, title, description, updated_at from park_contents limit ?, ?`, [
    contentsData.pageNum * CONTENTS_NUM_PER_PAGE,
    CONTENTS_NUM_PER_PAGE,
  ])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  for (let i = 0; i < data.length; i++) {
    let tags = await getContentTagsData(data[i].id)
    contentsData.contents[i] = {
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
  const contentsData = await getContentsData(searchParams)
  const Contents = contentsData.contents.map(content => {
    return <ContentPost contentData={content} key={content.id}></ContentPost>
  })
  return <>{Contents}</>
}

export default ContentsList

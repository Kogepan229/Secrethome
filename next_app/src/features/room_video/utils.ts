import { getContentTagsData } from 'features/tags/tags'
import { getDBConnection } from 'utils/sql'
import { ContentData } from './types'
import { SearchParams } from 'types/SearchParams'
import { CONTENTS_NUM_PER_PAGE } from './const'

/**
 * Start from 1
 */
export const getCurrentPageIndex = (searchParams: SearchParams) => {
  let currentPageIndex = Number(searchParams.page)
  return Number.isNaN(currentPageIndex) || currentPageIndex <= 0 ? 1 : currentPageIndex
}

export const getTotalContentsPageNum = async (roomId: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT COUNT(*) FROM contents WHERE room_id=?`, [roomId])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  let totalNum = Math.ceil((data[0]['COUNT(*)'] as number) / CONTENTS_NUM_PER_PAGE)
  return totalNum
}

export const getTotalContentsPageNumWithTag = async (tagID: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `SELECT COUNT(*) FROM contents WHERE id = ANY (SELECT content_id FROM tags_of_contents WHERE tag_id=?)`,
    [tagID]
  )
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  let totalNum = Math.ceil((data[0]['COUNT(*)'] as number) / CONTENTS_NUM_PER_PAGE)
  return totalNum
}

export const getContentsDataWithTags = async (tagID: string, currentPageIndex: number) => {
  let contentsData: ContentData[] = []

  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `SELECT * FROM contents WHERE id = ANY (SELECT content_id FROM tags_of_contents WHERE tag_id=?) LIMIT ?, ?`,
    [tagID, (currentPageIndex - 1) * CONTENTS_NUM_PER_PAGE, CONTENTS_NUM_PER_PAGE]
  )
  con.end()
  const data = JSON.parse(JSON.stringify(rows))

  for (let i = 0; i < data.length; i++) {
    let tags = await getContentTagsData(data[i].id)
    contentsData.push({
      id: data[i].id,
      title: data[i].title,
      description: data[i].description,
      tags: tags,
      updated_at: data[i].updated_at,
    })
  }

  return contentsData
}

import { getContentTagsData } from 'util/secret/park/tags'
import { getDBConnection } from 'util/sql'
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

export const getTotalContentsPageNum = async () => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`select count(*) from park_contents`)
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  let totalNum = Math.ceil((data[0]['count(*)'] as number) / CONTENTS_NUM_PER_PAGE)
  return totalNum
}

export const getTotalContentsPageNumWithTag = async (tagID: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `select count(*) from park_contents where id = any (select content_id from park_tags_of_contents where tag_id=?)`,
    [tagID]
  )
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  let totalNum = Math.ceil((data[0]['count(*)'] as number) / CONTENTS_NUM_PER_PAGE)
  return totalNum
}

export const getContentsDataWithTags = async (tagIDs: string[] | undefined, currentPageIndex: number) => {
  let contentsData: ContentData[] = []
  if (tagIDs == undefined || tagIDs.length === 0) {
    return contentsData
  }

  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `select * from park_contents where id = any (select content_id from park_tags_of_contents where tag_id=?) limit ?, ?`,
    [tagIDs[0], (currentPageIndex - 1) * CONTENTS_NUM_PER_PAGE, CONTENTS_NUM_PER_PAGE]
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

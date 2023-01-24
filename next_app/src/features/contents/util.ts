import { getContentTagsData } from 'util/secret/park/tags'
import { DB } from 'util/sql'
import { ContentData } from './types'

export const getContentsDataWithTags = async (tagIDs: string[] | undefined) => {
  let contentsData: ContentData[] = []
  if (tagIDs == undefined || tagIDs.length === 0) {
    return contentsData
  }

  let sqlResult = await DB.query<ContentData>(
    `select * from park_contents where id = any (select content_id from park_tags_of_contents where tag_id='${tagIDs[0]}')`
  )
  const data = JSON.parse(JSON.stringify(sqlResult))
  //console.log(data)
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
  //console.log(contentsData)
  return contentsData
}

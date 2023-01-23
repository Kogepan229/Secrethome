import { DB } from 'util/sql'

export type TagData = {
  id: string
  name: string
}

export type SidebarTagsData = { tag: TagData; count: number }[]

export const getContentTagsData = async (contentID: string) => {
  let result1 = await DB.query<{ tag_id: string; priority: number }[]>(
    `select tag_id, priority from park_tags_of_contents where content_id='${contentID}'`
  )

  type ContentTag = TagData & {
    priority: number
  }
  let _tags: ContentTag[] = []

  for (let value of result1) {
    let result2 = await DB.query<ContentTag[]>(`select id, name from park_tags where id='${value.tag_id}'`)
    _tags.push({ id: result2[0].id, name: result2[0].name, priority: value.priority })
  }

  _tags.sort((a: ContentTag, b: ContentTag) => {
    return a.priority - b.priority
  })

  let tags = _tags.map(value => {
    return { id: value.id, name: value.name } as TagData
  })

  return tags
}

export const getSidebarTagsData = async () => {
  let resultTag1 = await DB.query<TagData[]>(`select id, name from park_tags`)
  const dataTag = JSON.parse(JSON.stringify(resultTag1)) as TagData[]
  if (resultTag1.length == 0) {
    return []
  } else {
    let tags = await Promise.all(
      dataTag.map(async value => {
        let resultTag2 = await DB.query<any[]>(`select count(*) from park_tags_of_contents where tag_id='${value.id}'`)
        return { tag: value, count: resultTag2[0]['count(*)'] }
      })
    )
    tags.sort((a: { tag: TagData; count: number }, b: { tag: TagData; count: number }) => {
      return b.count - a.count
    })
    return tags
  }
}

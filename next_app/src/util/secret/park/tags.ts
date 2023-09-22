import { getDBConnection } from 'util/sql'

export type TagData = {
  id: string
  name: string
}

export type SidebarTagsData = { tag: TagData; count: number }[]

export const getContentTagsData = async (contentID: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`select tag_id, priority from park_tags_of_contents where content_id=?`, [contentID])
  const data1: { tag_id: string; priority: number }[] = JSON.parse(JSON.stringify(rows))

  type ContentTag = TagData & {
    priority: number
  }
  let _tags: ContentTag[] = []

  for (let value of data1) {
    let [rows2, _] = await con.query(`select id, name from park_tags where id=?`, [value.tag_id])
    let data2: ContentTag[] = JSON.parse(JSON.stringify(rows2))
    _tags.push({ id: data2[0].id, name: data2[0].name, priority: value.priority })
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
  const con = await getDBConnection()
  let [rows1, _] = await con.query(`select id, name from park_tags`)
  const data1 = JSON.parse(JSON.stringify(rows1)) as TagData[]
  if (data1.length == 0) {
    return []
  } else {
    let tags = await Promise.all(
      data1.map(async value => {
        let [rows2, _] = await con.query<any[]>(`select count(*) from park_tags_of_contents where tag_id=?`, [value.id])
        const data2 = JSON.parse(JSON.stringify(rows2)) as any[]
        return { tag: value, count: data2[0]['count(*)'] }
      })
    )
    tags.sort((a: { tag: TagData; count: number }, b: { tag: TagData; count: number }) => {
      return b.count - a.count
    })
    return tags
  }
}

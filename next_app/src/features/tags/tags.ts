import { getDBConnection } from 'utils/sql'

export type TagData = {
  id: string
  name: string
}

export type SidebarTagsData = { tag: TagData; count: number }[]

export const getContentTagsData = async (contentID: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT tag_id, priority FROM tags_of_contents WHERE content_id=?`, [contentID])
  const data1: { tag_id: string; priority: number }[] = JSON.parse(JSON.stringify(rows))

  type ContentTag = TagData & {
    priority: number
  }
  let _tags: ContentTag[] = []

  for (let value of data1) {
    let [rows2, _] = await con.query(`SELECT id, name FROM tags WHERE id=?`, [value.tag_id])
    let data2: ContentTag[] = JSON.parse(JSON.stringify(rows2))
    _tags.push({ id: data2[0].id, name: data2[0].name, priority: value.priority })
  }

  con.end()

  _tags.sort((a: ContentTag, b: ContentTag) => {
    return a.priority - b.priority
  })

  let tags = _tags.map(value => {
    return { id: value.id, name: value.name } as TagData
  })

  return tags
}

export const getSidebarTagsData = async (roomId: string) => {
  const con = await getDBConnection()
  let [rows1, _] = await con.query(`SELECT id, name FROM tags WHERE room_id=?`, [roomId])
  const data1 = JSON.parse(JSON.stringify(rows1)) as TagData[]
  console.log(data1, roomId)
  if (data1.length == 0) {
    return []
  } else {
    let tags = await Promise.all(
      data1.map(async value => {
        let [rows2, _] = await con.query<any[]>(`SELECT COUNT(*) FROM tags_of_contents WHERE tag_id=?`, [value.id])
        const data2 = JSON.parse(JSON.stringify(rows2)) as any[]
        return { tag: value, count: data2[0]['COUNT(*)'] }
      })
    )

    con.end()

    tags.sort((a: { tag: TagData; count: number }, b: { tag: TagData; count: number }) => {
      return b.count - a.count
    })
    return tags
  }
}

export const getTagName = async (tagID: string): Promise<string> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT name FROM tags WHERE id = ?`, [tagID])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  return data[0] ? data[0].name : ''
}

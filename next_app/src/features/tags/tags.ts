import { getDBConnection } from 'utils/sql'

export type TagData = {
  id: string
  name: string
}

export type SidebarTagsData = { tag: TagData; count: number }[]

export const getContentTagsData = async (contentID: string) => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `SELECT tags.id, tags.name FROM tags JOIN tags_of_contents ON tags.id = tags_of_contents.tag_id WHERE tags_of_contents.content_id=? ORDER BY tags_of_contents.priority`,
    [contentID]
  )
  con.end()

  const tags: TagData[] = JSON.parse(JSON.stringify(rows))

  return tags
}

export const getSidebarTagsData = async (roomId: string) => {
  const con = await getDBConnection()
  let [rows1, _] = await con.query(`SELECT id, name FROM tags WHERE room_id=?`, [roomId])
  const data1 = JSON.parse(JSON.stringify(rows1)) as TagData[]
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

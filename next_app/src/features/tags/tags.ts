import { getDBConnection } from 'utils/sql'

export type TagData = {
  id: string
  name: string
}

export type SidebarTagsData = { tag: TagData; count: number }[]

export const getContentTagsData = async (contentID: string): Promise<TagData[]> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(
    `SELECT tags.id, tags.name FROM tags JOIN tags_of_contents ON tags.id = tags_of_contents.tag_id WHERE tags_of_contents.content_id=? ORDER BY tags_of_contents.priority`,
    [contentID]
  )
  con.end()

  const tags: TagData[] = JSON.parse(JSON.stringify(rows))

  return tags
}

export const getSidebarTagsData = async (roomId: string): Promise<{ tag: TagData; count: number }[]> => {
  const con = await getDBConnection()
  let [rows1, _] = await con.query(
    `SELECT tags.id, tags.name, (SELECT COUNT(*) FROM tags_of_contents WHERE tag_id = tags.id) as count FROM tags WHERE tags.room_id=? ORDER BY count DESC, tags.name`,
    [roomId]
  )
  con.end()

  const data: any[] = JSON.parse(JSON.stringify(rows1))
  const tags = data.map(v => {
    return { tag: { id: v.id, name: v.name }, count: v.count }
  })
  return tags
}

export const getTagName = async (tagID: string): Promise<string> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT name FROM tags WHERE id = ?`, [tagID])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  return data[0] ? data[0].name : ''
}

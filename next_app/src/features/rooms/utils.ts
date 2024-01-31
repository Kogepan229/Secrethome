import { getDBConnection } from 'utils/sql'
import { RoomType } from './types'

export const getRoomType = async (roomId: string): Promise<RoomType> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query(`SELECT room_type FROM rooms WHERE id = ?`, [roomId])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  return convertRoomType(data[0] ? data[0].room_type : undefined)
}

export const convertRoomType = (roomTypeStr: string) => {
  console.log(roomTypeStr)
  switch (roomTypeStr) {
    case 'admin':
      return RoomType.Admin
    case 'video':
      return RoomType.Video
    case 'manga':
      return RoomType.Manga
    default:
      return RoomType.Unknown
  }
}

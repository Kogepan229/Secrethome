import { RoomType } from './types'
import axios from 'axios'

export const getRoomType = async (roomId: string): Promise<RoomType> => {
  const url = new URL('http://backend:60133' + '/api/rooms/type')
  url.search = new URLSearchParams({ id: roomId }).toString()

  const res = await axios.get(url.href)
  return convertRoomType(res.data.room_type)
}

export const convertRoomType = (roomTypeStr: string) => {
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

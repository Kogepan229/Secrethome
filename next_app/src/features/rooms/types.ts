export type RoomData = {
  id: string
  name: string
  description: string
  roomType: RoomType
  accessKey: string
}

export const enum RoomType {
  Admin = 'admin',
  Video = 'video',
  Manga = 'manga',
  Unknown = 'unknown',
}

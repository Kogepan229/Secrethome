import { getDBConnection } from 'utils/sql'
import css from './adminRoomPage.module.scss'
import Header from 'features/header/Header'
import { ContentsGridHeader } from 'components/ContentsGridHeader'
import { RoomType } from 'features/rooms/types'
import { convertRoomType } from 'features/rooms/utils'

type RoomInfo = {
  id: string
  name: string
  description: string
  type: RoomType
  accessKey: string
  contentNum: number
  tagNum: number
}

const getRoomInfo = async (roomId: string): Promise<RoomInfo> => {
  const con = await getDBConnection()
  let [rows, _] = await con.query(
    `SELECT name, description, room_type, access_key, (SELECT COUNT(*) from contents WHERE room_id=rooms.id) as content_num, (SELECT COUNT(*) from tags WHERE room_id=rooms.id) as tag_num FROM rooms WHERE id=?`,
    [roomId]
  )
  con.end()

  const data = JSON.parse(JSON.stringify(rows))[0]

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    type: convertRoomType(data.room_type),
    accessKey: data.access_key,
    contentNum: data.content_num,
    tagNum: data.tag_num,
  }
}

const RoomInfoPanel = async ({ roomId }: { roomId: string }) => {
  const info = await getRoomInfo(roomId)

  const numbers =
    info.type == RoomType.Admin ? null : (
      <>
        <p>コンテンツ数: {info.contentNum}</p>
        <p>タグ数: {info.tagNum}</p>
      </>
    )

  return (
    <div className={css.info_panel}>
      <p className={css.info_panel_name}>{info.name}</p>
      <p className={css.info_panel_desc}>{info.description}</p>
      <p>Type: {info.type}</p>
      <p>Access Key: {info.accessKey}</p>
      {numbers}
    </div>
  )
}

const RoomInfoPanelList = async () => {
  const con = await getDBConnection()
  let [rows, _] = await con.query(`SELECT id FROM rooms`)
  con.end()

  const data: any[] = JSON.parse(JSON.stringify(rows))

  return data.map(v => {
    return <RoomInfoPanel roomId={v.id} key={v.id} />
  })
}

const AdminRoomPage = async () => {
  return (
    <div>
      <Header roomId="" />
      <div className={css.main_container}>
        <ContentsGridHeader title="Room List" />
        <div className={css.info_panel_list}>
          <RoomInfoPanelList />
        </div>
      </div>
    </div>
  )
}

export default AdminRoomPage

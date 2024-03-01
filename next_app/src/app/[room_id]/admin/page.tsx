import Header from 'features/header/Header'
import css from './admin.module.scss'
import Link from 'next/link'
import { getRoomData } from 'features/rooms/utils'

const AdminPage = async ({ params }: { params: { room_id: string } }) => {
  const roomData = await getRoomData(params.room_id)

  const LinkItem = ({ url, text }: { url: string; text: string }) => {
    return (
      <Link href={url}>
        <div className={css.link_item}>{text}</div>
      </Link>
    )
  }

  return (
    <div>
      <Header roomName={roomData.name} link={`/${params.room_id}/contents`} />
      <div className={css.main_container}>
        <div className={css.admin_header}>
          <p>管理</p>
        </div>
        <div className={css.link_item_container}>
          <LinkItem url={`/${params.room_id}/admin/upload`} text="コンテンツ追加" />
          <LinkItem url={`/${params.room_id}/admin/`} text="コンテンツ管理" />
          <LinkItem url={`/${params.room_id}/admin/`} text="タグ管理" />
        </div>
      </div>
    </div>
  )
}

export default AdminPage

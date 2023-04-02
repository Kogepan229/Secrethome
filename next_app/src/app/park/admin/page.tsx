import Header from 'features/header/Header'
import css from './admin.module.scss'
import Link from 'next/link'

const AdminPage = async () => {
  const LinkItem = ({ url, text }: { url: string; text: string }) => {
    return (
      <Link href={url}>
        <div className={css.link_item}>{text}</div>
      </Link>
    )
  }

  return (
    <div>
      <Header />
      <div className={css.main_container}>
        <div className={css.admin_header}>
          <p>管理</p>
        </div>
        <div className={css.link_item_container}>
          <LinkItem url="/park/admin/add_content" text="コンテンツ追加" />
          <LinkItem url="/park/admin/" text="コンテンツ管理" />
          <LinkItem url="/park/admin/" text="タグ管理" />
        </div>
      </div>
    </div>
  )
}

export default AdminPage

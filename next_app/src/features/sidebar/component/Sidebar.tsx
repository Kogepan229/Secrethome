import Link from 'next/link'
import { TagData } from 'util/secret/park/tags'
import { SIDEBAR_DIV_ID } from '../const'
import css from './Sidebar.module.scss'

type Props = {
  tags: { tag: TagData; count: number }[]
  className?: string
  isHide?: boolean
}

const SideBar = (props: Props) => {
  const Tags = props.tags.map(value => {
    return (
      <Link href={`park/contents/tags?tags=${value.tag.id}`} key={value.tag.id}>
        <div className={css.sidebar_item_tag}>
          <p className={css.sidebar_item_tag_name}>{value.tag.name}</p>
          <div className={css.sidebar_item_tag_count}>
            <p>{value.count}</p>
          </div>
        </div>
      </Link>
    )
  })

  return (
    <div className={`${css.sidebar} ${props.className ?? ''}`} data-is-hide={props.isHide ?? false} id={SIDEBAR_DIV_ID}>
      <Link href="/park/admin" className={css.admin_link}>
        <p>管理</p>
      </Link>
      <div className={css.tag_list}>
        <div className={css.sidebar_title}>タグ一覧</div>
        {Tags}
      </div>
    </div>
  )
}

export default SideBar

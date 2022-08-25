import Link from "next/link"
import { Tag } from "util/secret/park/tags"
import { DB } from "util/sql"
import css from "./SideBar.module.scss"

type Props = {
  tags: {tag: Tag, count: number}[]
  className?: string;
  isHide?: boolean;
}

const SideBar = (props: Props) => {
  const Tags = props.tags.map(value => {
    return (
      <Link href={`/secret/park/tag/${value.tag.id}`} key={value.tag.id}>
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
    <div className={`${css.sidebar} ${props.className ?? ""}`} data-is-hide={props.isHide ?? false}>
      <div className={css.sidebat_title}>タグ一覧</div>
      {Tags}
    </div>
  )
}

export default SideBar
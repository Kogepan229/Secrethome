import Link from 'next/link'
import css from './Header.module.scss'

const Header = ({ roomId }: { roomId: string }) => {
  let url = `/${roomId}/contents`
  if (!roomId) {
    url = '/'
  }

  return (
    <div className={css.header}>
      <Link href={url}>
        <div className={css.header_logo}>Secret Home</div>
      </Link>
    </div>
  )
}

export default Header

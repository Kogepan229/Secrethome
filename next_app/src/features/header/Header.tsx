import Link from 'next/link'
import css from './Header.module.scss'

const Header = ({ roomName, link }: { roomName: string; link: string }) => {
  return (
    <div className={css.header}>
      <Link href={'/'}>
        <div className={css.header_logo}>Secret Home</div>
      </Link>
      <Link href={link}>
        <div className={css.header_room_name}>{roomName}</div>
      </Link>
    </div>
  )
}

export default Header

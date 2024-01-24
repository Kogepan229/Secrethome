import Link from 'next/link'
import css from './Header.module.scss'

const Header = ({ roomId }: { roomId: string }) => {
  return (
    <div className={css.header}>
      <Link href={`/${roomId}/contents`}>
        <div className={css.header_logo}>Secret Home</div>
      </Link>
    </div>
  )
}

export default Header

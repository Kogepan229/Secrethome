import Header from 'features/header/Header'
import css from './adminRoomPage.module.scss'

const AdminRoomPage = async () => {
  return (
    <div>
      <Header roomId="" />
      <div className={css.main_container}>This ia admin page</div>
    </div>
  )
}

export default AdminRoomPage

'use client'
import { ReactNode, useState } from 'react'
import Header from 'features/header/Header'
import SideBar from 'features/sidebar/component/Sidebar'
import css from './SecretRoomLayout.module.scss'
import { useModalScrollLock } from 'utils/useModalScrollLock'
import { SIDEBAR_DIV_ID } from 'features/sidebar/const'
import { SidebarTagsData } from 'features/tags/tags'

const SecretRoomLayout = ({ children, roomId, sidebarTags }: { children: ReactNode; roomId: string; sidebarTags: SidebarTagsData }) => {
  const [isHideMobileSidebar, setIsHideMobileSidebar] = useState(true)
  const showSidebar = () => {
    setIsHideMobileSidebar(false)
  }

  const onClickOverlay = () => {
    setIsHideMobileSidebar(true)
  }

  useModalScrollLock(!isHideMobileSidebar, SIDEBAR_DIV_ID)

  return (
    <div className={css.body_container}>
      <Header roomId={roomId} />
      <button className={css.show_sidebar_button} onClick={showSidebar}></button>
      <div className={css.container}>
        <SideBar roomId={roomId} className={css.mobile_sidebar} isHide={isHideMobileSidebar} tags={sidebarTags} />
        {isHideMobileSidebar ? null : <div className={css.overlay} onClick={onClickOverlay} />}
        {children}
      </div>
    </div>
  )
}

export default SecretRoomLayout

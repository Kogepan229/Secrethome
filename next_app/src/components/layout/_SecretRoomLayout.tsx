"use client"
import { ReactNode, useState } from "react";
import dynamic from 'next/dynamic';
//import SecretPageBase from "./secretPageBase";
import Header from "components/secret/park/Header";
import SideBar from "features/sidebar/component/Sidebar";
import css from "./SecretHomeLayout.module.scss"
import { SidebarTagsData } from "util/secret/park/tags";

const SecretRoomLayout = ({children, sidebarTags}: {children: ReactNode, sidebarTags: SidebarTagsData}) => {
  const [isHideMobileSidebar, setIsHideMobileSidebar] = useState(true)
  const showSidebar = () => {
    setIsHideMobileSidebar(false)
  }

  const onClickOverlay = () => {
    setIsHideMobileSidebar(true)
  }

  return (
    <div className={css.body_container}>
      <Header/>
      <button className={css.show_sidebar_button} onClick={showSidebar}></button>
      <div className={css.container}>
        <SideBar className={css.mobile_sidebar} isHide={isHideMobileSidebar} tags={sidebarTags}/>
        {isHideMobileSidebar ? null : <div className={css.overlay} onClick={onClickOverlay}/>}
        {children}
      </div>
    </div>
  )
}

export default SecretRoomLayout
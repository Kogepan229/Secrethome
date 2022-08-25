import { ReactNode, useState } from "react";
import dynamic from 'next/dynamic';
//import SecretPageBase from "./secretPageBase";
import Header from "components/secret/park/Header";
import SideBar from "components/secret/park/SideBar";
import css from "./SecretHomeLayout.module.scss"
import { Tag } from "util/secret/park/tags";

const SecretPageBase = dynamic(() => import("./secretPageBase"), {ssr: false})

const SecretHomeLayout = ({children, sidebar_tags}: {children: ReactNode, sidebar_tags: {tag: Tag, count: number}[]}) => {
  const [isHideMobileSidebar, setIsHideMobileSidebar] = useState(true)

  const showSidebar = () => {
    setIsHideMobileSidebar(false)
  }

  const onClickOverlay = () => {
    setIsHideMobileSidebar(true)
  }

  return (
    <SecretPageBase>
      <div className={css.body_container}>
        <Header/>
        <button className={css.show_sidebar_button} onClick={showSidebar}></button>
        <div className={css.container}>
          <SideBar tags={sidebar_tags} className={css.mobile_sidebar} isHide={isHideMobileSidebar}/>
          {isHideMobileSidebar ? null : <div className={css.overlay} onClick={onClickOverlay}/>}
          {children}
        </div>
      </div>
    </SecretPageBase>
  )
}

export default SecretHomeLayout
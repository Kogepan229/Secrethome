"use client"
import "client-only"
import axios from 'axios';
import { useState } from 'react';
import Router from 'next/router';
import css from "./ContentDeleteButton.module.scss"

import PopupWindowMessage from 'components/PopupWindowMessage';
import { useRouter } from "next/navigation";

const ContentDeleteButton = ({contentID}: {contentID: string}) => {
  const router = useRouter()
  const [isShowPopup, setIsShowPopup] = useState(false)

  const onClickDelete = () => {
    let result = window.confirm("削除しますか")
    if (result) {
      axios.delete("/api/secret/park/delete_content", {data: {id: contentID}}).then(res => {
        if (res.data.result == "success") {
          setIsShowPopup(true)
        } else {
          console.error("res:", res.data.result)
        }
      })
    }
  }

  return (
    <>
      <button className={css.delete_button} onClick={onClickDelete}>削除</button>
      <PopupWindowMessage isShow={isShowPopup} message="削除しました" buttonText='戻る' buttonCallback={() => router.push("/park/contents/")}/>
    </>
  )
}

export default ContentDeleteButton
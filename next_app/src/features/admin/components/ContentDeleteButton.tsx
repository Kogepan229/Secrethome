'use client'
import 'client-only'
import axios from 'axios'
import { useState } from 'react'
import css from './ContentDeleteButton.module.scss'

import PopupWindowMessage from 'components/PopupWindowMessage'
import { useRouter } from 'next/navigation'

const ContentDeleteButton = ({ contentID }: { contentID: string }) => {
  const router = useRouter()
  const [isShowPopup, setIsShowPopup] = useState(false)

  const onClickDelete = () => {
    let result = window.confirm('削除しますか')
    if (result) {
      let data = new FormData()
      data.append('id', contentID)
      axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/content', { data: data })
        .then(res => {
          setIsShowPopup(true)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  return (
    <>
      <button className={css.delete_button} onClick={onClickDelete}>
        削除
      </button>
      <PopupWindowMessage
        isShow={isShowPopup}
        message="削除しました"
        buttonText="戻る"
        buttonCallback={() => router.push('/park/contents/')}
      />
    </>
  )
}

export default ContentDeleteButton

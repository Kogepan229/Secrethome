'use client'
import 'client-only'
import axios from 'axios'
import { useState } from 'react'
import css from './EditContentForm.module.scss'

import PopupWindowMessage from 'components/PopupWindowMessage'
import { useRouter } from 'next/navigation'
import SimpleButton from 'components/SimpleButton'

const ContentDeleteButton = ({ roomId, contentID }: { roomId: string; contentID: string }) => {
  const router = useRouter()
  const [isShowPopup, setIsShowPopup] = useState(false)

  const onClickDelete = () => {
    let result = window.confirm('削除しますか')
    if (result) {
      let data = new FormData()
      data.append('id', contentID)
      axios
        .delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/contents', { data: data })
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
      <SimpleButton className={css.button_delete} onClick={onClickDelete}>
        削除
      </SimpleButton>
      <PopupWindowMessage
        isShow={isShowPopup}
        message="削除しました"
        buttonText="戻る"
        buttonCallback={() => router.push(`/${roomId}/contents/`)}
      />
    </>
  )
}

export default ContentDeleteButton

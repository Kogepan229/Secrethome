'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import css from 'components/editForm/EditContentForm.module.scss'
import { useEditDescription } from 'components/editForm/EditDescription'
import { useEditImage } from 'components/editForm/EditImage'
import { useEditTags } from 'components/editForm/EditTags'
import { useEditTitle } from 'components/editForm/EditTitle'
import { useEditVideo } from 'components/editForm/EditVideo'
import { useProgressBar } from 'components/editForm//ProgressBar'
import PopupWindowMessage from 'components/PopupWindowMessage'
import SimpleButton from 'components/SimpleButton'
import Header from 'features/header/Header'

const UploadContentForm = ({ roomId }: { roomId: string }) => {
  const router = useRouter()

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isStartedUpload, setIsStartedUpload] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState('')

  const { EditTitle, title } = useEditTitle({ title: '' })
  const { EditDescription, description } = useEditDescription({ description: '' })
  const { EditTags, selectedTagList } = useEditTags({ roomId: roomId, selectedTagList: [] })
  const { EditVideo, getVideoImage, video, isVideoStopped } = useEditVideo({})
  const { EditImage, image } = useEditImage({ isVideoStopped: isVideoStopped, getVideoImage: getVideoImage })
  const { ProgressBar, onProgress } = useProgressBar({ enabled: isStartedUpload })

  useEffect(() => {
    if (title && description && video && image) {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [title, description, video, image])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const file = new FormData()
    file.append('room_id', roomId)
    file.append('title', title)
    file.append('description', description)
    file.append('tagIDs', JSON.stringify(selectedTagList.map(value => value.id)))
    file.append('video', video!)
    file.append('image', image!)

    setIsStartedUpload(true)
    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/contents/video', file, {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: onProgress,
      })
      .then(res => {
        setIsShowCompletePopup(res.data.id)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <>
      <Header roomId={roomId} />
      <div className={css.form}>
        <h2 className={css.form_header}>アップロード</h2>
        {EditTitle}
        {EditDescription}
        {EditTags}
        {EditVideo}
        {EditImage}
        <div>
          <SimpleButton className={css.button_submit} onClick={handleSubmit} disabled={!isEnableSubmit}>
            追加
          </SimpleButton>
        </div>
        {ProgressBar}
      </div>
      <PopupWindowMessage
        isShow={!!isShowCompletePopup}
        message={'追加しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/${roomId}/contents/${isShowCompletePopup}`)}
      />
    </>
  )
}

export default UploadContentForm

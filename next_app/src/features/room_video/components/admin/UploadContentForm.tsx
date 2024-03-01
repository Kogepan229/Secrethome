'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import css from 'features/rooms/components/editForm/EditContentForm.module.scss'
import { useFormPartText } from 'components/form/FormPartText'
import { useFormPartTextArea } from 'components/form/FormPartTextArea'
import { useEditImage } from 'features/rooms/components/editForm/EditImage'
import { useEditTags } from 'features/rooms/components/editForm/EditTags'
import { useEditVideo } from 'features/rooms/components/editForm/EditVideo'
import { useProgressBar } from 'features/rooms/components/editForm//ProgressBar'
import PopupWindowMessage from 'components/PopupWindowMessage'
import SimpleButton from 'components/SimpleButton'
import Header from 'features/header/Header'
import { ContentsGridHeader } from 'components/ContentsGridHeader'

const UploadContentForm = ({ roomId, roomName }: { roomId: string; roomName: string }) => {
  const router = useRouter()

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isStartedUpload, setIsStartedUpload] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState('')

  const [FormPartTitle, title] = useFormPartText({ title: 'タイトル', name: 'name' })
  const [FormPartDescription, description] = useFormPartTextArea({ title: '概要', name: 'description' })
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
      <Header roomName={roomName} link={`/${roomId}/contents`} />
      <div className={css.form}>
        <ContentsGridHeader title="アップロード" />
        {FormPartTitle}
        {FormPartDescription}
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

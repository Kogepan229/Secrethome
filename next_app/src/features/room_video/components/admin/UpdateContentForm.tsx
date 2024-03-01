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
import { useProgressBar } from 'features/rooms/components/editForm/ProgressBar'
import ContentDeleteButton from 'features/rooms/components/editForm/ContentDeleteButton'
import PopupWindowMessage from 'components/PopupWindowMessage'
import SimpleButton from 'components/SimpleButton'
import { TagData } from 'features/tags/tags'
import Header from 'features/header/Header'
import { ContentsGridHeader } from 'components/ContentsGridHeader'

type Props = {
  id: string
  roomName: string
  roomId: string
  title: string
  description: string
  updatedAt: string
  selectedTagList: TagData[]
}

const UpdateContentForm = (props: Props) => {
  const router = useRouter()

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isStartedUpload, setIsStartedUpload] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState('')

  const [FormPartTitle, title] = useFormPartText({ title: 'タイトル', name: 'name', initial: props.title })
  const [FormPartDescription, description] = useFormPartTextArea({ title: '概要', name: 'description', initial: props.description })
  const { EditTags, selectedTagList } = useEditTags({ roomId: props.roomId, selectedTagList: props.selectedTagList })
  const { EditVideo, getVideoImage, video, isUpdatedVideo, isVideoStopped } = useEditVideo({
    videoSrc: `${process.env.NEXT_PUBLIC_FILESERVER_URL}/video/contents/${props.id}/${props.id}.mp4?${props.updatedAt}`,
  })
  const { EditImage, image, isUpdatedImage } = useEditImage({
    isVideoStopped: isVideoStopped,
    getVideoImage: getVideoImage,
    imageSrc: `${process.env.NEXT_PUBLIC_FILESERVER_URL}/video/contents/${props.id}/${props.id}.webp?${props.updatedAt}`,
  })
  const { ProgressBar, onProgress } = useProgressBar({ enabled: isStartedUpload })

  useEffect(() => {
    if (title && description) {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [title, description, video, image])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const file = new FormData()
    file.append('id', props.id)
    file.append('title', title)
    file.append('description', description)
    file.append('tagIDs', JSON.stringify(selectedTagList.map(value => value.id)))
    if (isUpdatedVideo) {
      file.append('video', video!)
    }
    if (isUpdatedImage) {
      file.append('image', image!)
    }

    setIsStartedUpload(true)
    axios
      .put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/contents/video', file, {
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
      <Header roomName={props.roomName} link={`/${props.roomId}/contents`} />
      <div className={css.form}>
        <ContentsGridHeader title="アップデート" />
        {FormPartTitle}
        {FormPartDescription}
        {EditTags}
        {EditVideo}
        {EditImage}
        <div className={css.exec_button_container}>
          <SimpleButton className={css.button_submit} onClick={handleSubmit} disabled={!isEnableSubmit}>
            更新
          </SimpleButton>
          <ContentDeleteButton roomId={props.roomId} contentID={props.id} />
        </div>
        {ProgressBar}
      </div>
      <PopupWindowMessage
        isShow={!!isShowCompletePopup}
        message={'更新しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/${props.roomId}/contents/${isShowCompletePopup}`)}
      />
    </>
  )
}

export default UpdateContentForm

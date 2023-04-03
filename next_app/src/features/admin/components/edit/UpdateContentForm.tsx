'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import css from './EditContentForm.module.scss'

import { useEditDescription } from './EditDescription'
import { useEditImage } from './EditImage'
import { useEditTags } from './EditTags'
import { useEditTitle } from './EditTitle'
import { useEditVideo } from './EditVideo'
import { TagData } from 'util/secret/park/tags'
import PopupWindowMessage from 'components/PopupWindowMessage'

type Props = {
  id: string
  title: string
  description: string
  updatedAt: string
  selectedTagList: TagData[]
}

const UpdateContentForm = (props: Props) => {
  console.log('UpdateContentForm')
  const router = useRouter()
  const { EditTitle, title } = useEditTitle({ title: props.title })
  const { EditDescription, description } = useEditDescription({ description: props.description })
  const { EditTags, selectedTagList } = useEditTags({ selectedTagList: props.selectedTagList })
  const { EditVideo, getVideoImage, video, isUpdatedVideo, isVideoStopped } = useEditVideo({
    videoSrc: `${process.env.NEXT_PUBLIC_FILESERVER_URL}/contents/${props.id}/${props.id}.mp4?${props.updatedAt}`,
  })
  const { EditImage, image, isUpdatedImage } = useEditImage({
    isVideoStopped: isVideoStopped,
    getVideoImage: getVideoImage,
    imageSrc: `${process.env.NEXT_PUBLIC_FILESERVER_URL}/contents/${props.id}/${props.id}.webp?${props.updatedAt}`,
  })

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isStartedUpload, setIsStartedUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [isShowCompletePopup, setIsShowCompletePopup] = useState('')

  useEffect(() => {
    if (title && description) {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [title, description, video, image])

  const onUploadProgress = (progressEvent: any) => {
    console.log(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
  }

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
      .put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/content', file, {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress,
      })
      .then(res => {
        setIsShowCompletePopup(res.data.id)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const UploadProgressBar = () => {
    if (!isStartedUpload) return null

    return (
      <div>
        <p>{uploadProgress}%</p>
        <progress value={uploadProgress} max="100" />
      </div>
    )
  }

  return (
    <>
      <div className={css.form}>
        {EditTitle}
        {EditDescription}
        {EditTags}
        {EditVideo}
        {EditImage}
        <div>
          <input type="button" onClick={handleSubmit} value={'更新'} disabled={!isEnableSubmit}></input>
        </div>
        <UploadProgressBar />
      </div>
      <PopupWindowMessage
        isShow={!!isShowCompletePopup}
        message={'更新しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/park/contents/${isShowCompletePopup}`)}
      />
    </>
  )
}

export default UpdateContentForm

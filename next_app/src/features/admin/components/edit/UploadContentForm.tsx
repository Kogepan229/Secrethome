'use client'
import { useEffect, useState } from 'react'
import css from './EditContentForm.module.scss'

import { useEditDescription } from './EditDescription'
import { useEditImage } from './EditImage'
import { useEditTags } from './EditTags'
import { useEditTitle } from './EditTitle'
import { useEditVideo } from './EditVideo'
import { useProgressBar } from './ProgressBar'
import axios from 'axios'
import PopupWindowMessage from 'components/PopupWindowMessage'
import { useRouter } from 'next/navigation'

const UploadContentForm = () => {
  console.log('UploadContentForm')
  const router = useRouter()

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isStartedUpload, setIsStartedUpload] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState('')

  const { EditTitle, title } = useEditTitle({ title: '' })
  const { EditDescription, description } = useEditDescription({ description: '' })
  const { EditTags, selectedTagList } = useEditTags({ selectedTagList: [] })
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
    file.append('title', title)
    file.append('description', description)
    file.append('tagIDs', JSON.stringify(selectedTagList.map(value => value.id)))
    file.append('video', video!)
    file.append('image', image!)

    setIsStartedUpload(true)
    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/content', file, {
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
      <div className={css.form}>
        {EditTitle}
        {EditDescription}
        {EditTags}
        {EditVideo}
        {EditImage}
        <div>
          <input type="button" onClick={handleSubmit} value={'追加'} disabled={!isEnableSubmit}></input>
        </div>
        {ProgressBar}
      </div>
      <PopupWindowMessage
        isShow={!!isShowCompletePopup}
        message={'追加しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/park/contents/${isShowCompletePopup}`)}
      />
    </>
  )
}

export default UploadContentForm

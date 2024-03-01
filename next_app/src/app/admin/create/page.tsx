'use client'
import { useFormPartText } from 'components/form/FormPartText'
import Header from 'features/header/Header'
import css from './createRoomPage.module.scss'
import { ContentsGridHeader } from 'components/ContentsGridHeader'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PopupWindowMessage from 'components/PopupWindowMessage'
import { useRouter } from 'next/navigation'
import SimpleButton from 'components/SimpleButton'
import { useFormPartSelect } from 'components/form/FormPartSelect'

const createOptions = (): { value: string; name: string }[] => {
  return [
    {
      value: '',
      name: 'Select Room Type',
    },
    {
      value: 'video',
      name: 'Video',
    },
    {
      value: 'manga',
      name: 'Manga',
    },
  ]
}

const Page = () => {
  const router = useRouter()

  const [FormPartId, id] = useFormPartText({ title: 'ID', name: 'id' })
  const [FormPartName, name] = useFormPartText({ title: '名前', name: 'name' })
  const [FormPartType, type] = useFormPartSelect({ title: 'Room Type', name: 'type', options: createOptions() })
  const [FormPartAccessKey, accessKey] = useFormPartText({ title: 'Access Key', name: 'access_key' })

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState(false)

  useEffect(() => {
    if (id && name && type && accessKey) {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [id, name, type, accessKey])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const file = new FormData()
    file.append('id', id)
    file.append('name', name)
    file.append('access_key', accessKey)

    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/room', file, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then(res => {
        setIsShowCompletePopup(true)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <>
      <Header roomId="" />
      <div className={css.form}>
        <ContentsGridHeader title="新規ルーム作成" />
        {FormPartId}
        {FormPartName}
        {FormPartType}
        {FormPartAccessKey}
        <SimpleButton className={css.button_submit} onClick={handleSubmit} disabled={!isEnableSubmit}>
          作成
        </SimpleButton>
      </div>
      <PopupWindowMessage
        isShow={isShowCompletePopup}
        message={'作成しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/admin}`)}
      />
    </>
  )
}

export default Page

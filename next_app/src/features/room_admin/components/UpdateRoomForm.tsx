'use client'
import { useFormPartText } from 'components/form/FormPartText'
import Header from 'features/header/Header'
import css from 'components/form/FormParts.module.scss'
import { ContentsGridHeader } from 'components/ContentsGridHeader'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PopupWindowMessage from 'components/PopupWindowMessage'
import { useRouter } from 'next/navigation'
import SimpleButton from 'components/SimpleButton'
import { RoomData } from 'features/rooms/types'
import { useFormPartTextArea } from 'components/form/FormPartTextArea'

export const UpdateRoomForm = ({ roomData }: { roomData: RoomData }) => {
  const router = useRouter()

  const [FormPartName, name] = useFormPartText({ title: '名前', name: 'name', initial: roomData.name })
  const [FormPartDescription, description] = useFormPartTextArea({ title: '概要', name: 'description', initial: roomData.description })
  const [FormPartAccessKey, accessKey] = useFormPartText({ title: 'Access Key', name: 'access_key', initial: roomData.accessKey })

  const [isEnableSubmit, setIsEnableSubmit] = useState(false)
  const [isShowCompletePopup, setIsShowCompletePopup] = useState(false)

  useEffect(() => {
    if (name && accessKey) {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [name, accessKey])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const file = new FormData()
    file.append('id', roomData.id)
    file.append('name', name)
    file.append('description', description)
    file.append('key', accessKey)

    axios
      .put(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/rooms', file, {
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
      <Header roomName="Admin" link="/admin/" />
      <div className={css.form}>
        <ContentsGridHeader title="ルーム情報更新" />
        {FormPartName}
        {FormPartDescription}
        {FormPartAccessKey}
        <SimpleButton className={css.button_submit} onClick={handleSubmit} disabled={!isEnableSubmit}>
          更新
        </SimpleButton>
      </div>
      <PopupWindowMessage
        isShow={isShowCompletePopup}
        message={'更新しました'}
        buttonText="戻る"
        buttonCallback={() => router.push(`/admin`)}
      />
    </>
  )
}

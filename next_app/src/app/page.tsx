'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import css from './index.module.scss'
import { convertRoomType } from 'features/rooms/utils'
import { RoomType } from 'features/rooms/types'

const Home = () => {
  const router = useRouter()
  const [key, setKey] = useState('')

  const handleSubmit = (event: any) => {
    event.preventDefault()
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/rooms/key', { params: { key: key } })
      .then(res => {
        if (convertRoomType(res.data.room_type) == RoomType.Admin) {
          router.push('/admin/')
        } else if (res.data.id) {
          router.push(`/${res.data.id}/contents`)
        } else {
          setKey('')
        }
      })
      .catch(() => {
        setKey('')
      })
  }

  const handleChangeKey = (event: any) => {
    setKey(event.target.value)
  }

  return (
    <div>
      <form className={css.key_form} onSubmit={handleSubmit}>
        <input
          className={css.key_input}
          spellCheck="false"
          autoComplete="off"
          type={'text'}
          name={'key'}
          value={key}
          onChange={handleChangeKey}
        ></input>
      </form>
    </div>
  )
}

export default Home

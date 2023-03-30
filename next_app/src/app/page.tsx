'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import css from './index.module.scss'

const Home = () => {
  const router = useRouter()
  const [key, setKey] = useState('')

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const data = new FormData()
    data.append("key", key)
    axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/secretkey', data).then(res => {
      console.log(res.data)
      if (res.data.url) {
        router.push(res.data.url)
      } else {
        setKey('')
      }
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

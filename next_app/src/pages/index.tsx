import type { NextPage } from 'next'
import axios from "axios"
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import css from "styles/pages/index.module.scss"

const Home: NextPage = () => {
  const router = useRouter()
  const [key, setKey] = useState("")

  const handleSubmit = (event: any) => {
    event.preventDefault()
    axios.post("/api/secret/secretkey", {key: key}).then(res => {
      if (res.data.url) {
        router.push(res.data.url)
      } else {
        setKey("")
      }
    })
  }

  const handleChangeKey = (event: any) => {
    setKey(event.target.value)
  }


  return (
    <div>
      <form className={css.key_form} onSubmit={handleSubmit}>
        <input className={css.key_input} spellCheck="false" autoComplete="off" type={"text"} name={"key"} value={key} onChange={handleChangeKey}></input>
      </form>
    </div>
  )
}

export default Home

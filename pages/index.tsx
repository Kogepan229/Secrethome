import type { NextPage } from 'next'
import axios from "axios"
import React, { useState } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const [key, setKey] = useState("")

  const handleSubmit = (event: any) => {
    event.preventDefault()
    axios.post("/api/secretkey", {key: key}).then(res => {
      console.log(res.data)
      router.push(res.data.url, "/")
    })
  }

  const handleChangeKey = (event: any) => {
    setKey(event.target.value)
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input spellCheck="false" autoComplete="off" type={"text"} name={"key"} value={key} onChange={handleChangeKey}></input>
      </form>
    </div>
  )
}

export default Home

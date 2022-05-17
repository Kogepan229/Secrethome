import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Secret: NextPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.push("/")
    }, [])

    return (<p>secret</p>)
}

export default Secret
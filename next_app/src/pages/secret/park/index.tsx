import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Park: NextPage = () => {
    const router = useRouter()
    useEffect(() => {
        router.replace("/secret/park/contents")
    }, [])
    return (<p>Here is park</p>)
}

export default Park
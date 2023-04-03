'use client'
import { useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'
import { AxiosProgressEvent } from 'axios'

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div>
      <p>{progress}%</p>
      <progress value={progress} max="100" />
    </div>
  )
}

export const useProgressBar = ({ enabled }: { enabled: boolean }) => {
  const [progress, setProgress] = useState(0)

  const onProgress = (progressEvent: AxiosProgressEvent) => {
    if (!progressEvent.total) return
    console.log(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
  }

  const progressBar = useMemo(() => (enabled ? <ProgressBar progress={progress} /> : null), [enabled, progress])

  return {
    ProgressBar: progressBar,
    onProgress: onProgress,
  }
}

'use client'
import { useEffect, useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'
import { AxiosProgressEvent } from 'axios'

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div id="progress_bar">
      <p>{progress}%</p>
      <progress value={progress} max="100" />
    </div>
  )
}

export const useProgressBar = ({ enabled }: { enabled: boolean }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (enabled) {
      window.location.hash = 'progress_bar'
    }
  }, [enabled])

  const onProgress = (progressEvent: AxiosProgressEvent) => {
    if (!progressEvent.total) return
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
  }

  const progressBar = useMemo(() => (enabled ? <ProgressBar progress={progress} /> : null), [enabled, progress])

  return {
    ProgressBar: progressBar,
    onProgress: onProgress,
  }
}

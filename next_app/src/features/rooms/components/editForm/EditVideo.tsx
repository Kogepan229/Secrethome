'use client'
import dynamic from 'next/dynamic'
import css from './EditContentForm.module.scss'
import React, { useCallback, useMemo, useRef, useState } from 'react'

const VideoPlayer = dynamic(() => import('components/VideoPlayer/VideoPlayer'), { ssr: false, suspense: true })

const EditVideo = ({
  videoRef,
  videoSrc,
  setVideo,
  setUpdated,
  setIsStopped,
}: {
  videoRef: React.RefObject<HTMLVideoElement>
  videoSrc?: string
  setVideo: React.Dispatch<React.SetStateAction<File | null>>
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>
  setIsStopped: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [_videoSrc, setVideoSrc] = useState(videoSrc)
  const [videoName, setVideoName] = useState('未選択')

  const onStopVideo = useCallback(() => {
    setIsStopped(true)
  }, [])

  const onPlayingVideo = useCallback(() => {
    setIsStopped(false)
  }, [])

  const handleChangeMovie = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0])
      setVideoSrc(URL.createObjectURL(e.target.files[0]))
      setVideoName(e.target.files[0].name)
      setUpdated(true)
    }
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLVideoElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files[0].type === 'video/mp4') {
      setVideo(e.dataTransfer.files[0])
      setVideoSrc(URL.createObjectURL(e.dataTransfer.files[0]))
      setVideoName(e.dataTransfer.files[0].name)
      setUpdated(true)
    }
  }

  return (
    <div>
      <div>
        <h4 className={css.item_header}>動画ファイル(mp4)</h4>
        <div className={css.input_file_container}>
          <label className={css.input_file}>
            <input type="file" accept=".mp4" onChange={handleChangeMovie}></input>
            ファイルを選択
          </label>
          <p className={css.input_file_name}>{videoName}</p>
        </div>
      </div>
      <div className={css.video_div}>
        <VideoPlayer
          src={_videoSrc}
          controls
          videoRef={videoRef}
          onPause={onStopVideo}
          onSeeked={onStopVideo}
          onPlay={onPlayingVideo}
          onSeeking={onPlayingVideo}
          onDragOverController={e => e.preventDefault()}
          onDropController={handleDrop}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  )
}

export const useEditVideo = ({ videoSrc }: { videoSrc?: string }) => {
  const [video, setVideo] = useState<File | null>(null)
  const [updated, setUpdated] = useState(false)
  const [isStopped, setIsStopped] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)

  const getVideoImage = () => {
    return new Promise<File | null>(resolve => {
      if (!videoRef.current) {
        resolve(null)
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight)
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(new File([blob], 'image.webp', { type: 'image/webp' }))
            return
          } else {
            resolve(null)
            return
          }
        },
        'image/webp',
        1
      )
    })
  }

  const editVideo = useMemo(
    () => <EditVideo videoRef={videoRef} videoSrc={videoSrc} setVideo={setVideo} setUpdated={setUpdated} setIsStopped={setIsStopped} />,
    [videoRef, videoRef]
  )

  return {
    EditVideo: editVideo,
    getVideoImage: getVideoImage,
    video: video,
    isUpdatedVideo: updated,
    isVideoStopped: isStopped,
  }
}

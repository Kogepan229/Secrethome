'use client'
import css from './EditContentForm.module.scss'
import React, { useCallback, useMemo, useRef, useState } from 'react'

const EditVideo = ({
  videoRef,
  videoSrc,
  //videoName,
  setVideo,
  //updated,
  setUpdated,
  //isStopped,
  setIsStopped,
}: {
  videoRef: React.RefObject<HTMLVideoElement>
  videoSrc?: string
  //videoName: string | null
  setVideo: React.Dispatch<React.SetStateAction<File | null>>
  //updated: boolean
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>
  //isStopped: boolean
  setIsStopped: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  console.log('EditVideo')
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
      // console.log(e.dataTransfer.files[0])
      setVideo(e.dataTransfer.files[0])
      setVideoSrc(URL.createObjectURL(e.dataTransfer.files[0]))
      setVideoName(e.dataTransfer.files[0].name)
      setUpdated(true)
    }
  }

  return (
    <div>
      <div>
        <p>動画ファイル(mp4)</p>
        <div className={css.input_file_container}>
          <label className={css.input_file}>
            <input type="file" accept=".mp4" onChange={handleChangeMovie}></input>
            ファイルを選択
          </label>
          <p className={css.input_file_name}>{videoName}</p>
        </div>
      </div>
      <div className={css.video_div}>
        <video
          src={_videoSrc}
          controls
          ref={videoRef}
          onPause={onStopVideo}
          onSeeked={onStopVideo}
          onPlay={onPlayingVideo}
          onSeeking={onPlayingVideo}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          crossOrigin="anonymous"
        ></video>
      </div>
    </div>
  )
}

export const useEditVideo = ({ videoSrc }: { videoSrc?: string }) => {
  console.log('useEditVideo')
  const [video, setVideo] = useState<File | null>(null)
  const [updated, setUpdated] = useState(false)
  const [isStopped, setIsStopped] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)

  const getVideoImage = () => {
    console.log('getVideoImage')

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

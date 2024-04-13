'use client'
import 'client-only'
import { DetailedHTMLProps, RefObject, VideoHTMLAttributes, useRef } from 'react'
import { browserName } from 'detect-browser'
import css from './VideoPlayer.module.scss'
import VideoControl from './VideoControl'

type Props = DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> & {
  videoRef: RefObject<HTMLVideoElement>
}

const VideoPlayer = (props: Props) => {
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const { ['videoRef']: {} = {}, ...p2 } = props

  return (
    <div className={css.video_container} ref={videoContainerRef}>
      <div className={css.video_wrapper}>
        {(() => {
          if (typeof window !== 'undefined' && browserName(window.navigator.userAgent) !== 'ios') {
            return (
              <>
                <video {...p2} className={css.video} ref={props.videoRef} controls={false}>
                  <VideoControl videoRef={props.videoRef} videoContainerRef={videoContainerRef}></VideoControl>
                </video>
              </>
            )
          } else {
            return <video {...p2} className={css.video} ref={props.videoRef} controls playsInline></video>
          }
        })()}
      </div>
    </div>
  )
}

export default VideoPlayer

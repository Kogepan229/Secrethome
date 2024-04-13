'use client'
import 'client-only'
import { DetailedHTMLProps, DragEventHandler, RefObject, VideoHTMLAttributes, useRef } from 'react'
import { browserName } from 'detect-browser'
import css from './VideoPlayer.module.scss'
import VideoControl from './VideoControl'

type Props = DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> & {
  videoRef: RefObject<HTMLVideoElement>
  onDragOverController?: DragEventHandler
  onDropController?: DragEventHandler
}

const VideoPlayer = (props: Props) => {
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const { ['videoRef']: {} = {}, ['onDragOverController']: {} = {}, ['onDropController']: {} = {}, ...p2 } = props

  return (
    <div className={css.video_container} ref={videoContainerRef}>
      <div className={css.video_wrapper}>
        {(() => {
          if (typeof window !== 'undefined' && browserName(window.navigator.userAgent) !== 'ios') {
            return (
              <>
                <video {...p2} className={css.video} ref={props.videoRef} controls={false}></video>
                <VideoControl
                  videoRef={props.videoRef}
                  videoContainerRef={videoContainerRef}
                  onDragOverController={props.onDragOverController}
                  onDropController={props.onDropController}
                ></VideoControl>
              </>
            )
          } else {
            return (
              <video
                {...p2}
                className={css.video}
                ref={props.videoRef}
                controls
                playsInline
                onDrop={props.onDropController}
                onDragOver={props.onDragOverController}
              ></video>
            )
          }
        })()}
      </div>
    </div>
  )
}

export default VideoPlayer

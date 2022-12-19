"use client"
import React, { useMemo } from "react";
import { ReactEventHandler, ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";
import css from "./VideoControl.module.scss"

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  videoContainerRef: RefObject<HTMLDivElement>;
}

const VideoControl = (props: Props) => {
  const controlContainerRef = useRef<HTMLDivElement>(null)
  const controlVolumeSliderRef = useRef<HTMLInputElement>(null)
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMute, setIsMute] = useState(false)
  const [displayTime, setDisplayTime] = useState("0:00 / 0:00")
  const [isFullScreen, setIsfullScreen] = useState(false)
  const [isCursorOutVideo, setIsCursorOutVideo] = useState(false)
  const [isCursorOnControls, setIsCursorOnControls] = useState(false)

  const onVideoResize = () => {
    //要素のリサイズイベント取得
    const resizeable = props.videoRef.current!
    const observer = new ResizeObserver(() => {
      //要素のサイズ確認
      setVideoWidth(resizeable.getBoundingClientRect().width)
      setVideoHeight(resizeable.getBoundingClientRect().height)
    })
    observer.observe(resizeable)
  }

  useEffect(() => {
    onVideoResize()

    props.videoRef.current?.addEventListener("timeupdate", onVideoTimeUpdate)
    props.videoRef.current?.addEventListener("loadedmetadata", onVideoTimeUpdate)
    props.videoRef.current?.addEventListener("loadedmetadata", () => {
      controlVolumeSliderRef.current!.value = (props.videoRef.current!.volume * 100).toString()
    })

    // load volume from LocalStorage
    if (localStorage.getItem("volume")) {
      setVolume(Number(localStorage.getItem("volume")))
      controlVolumeSliderRef.current!.value = localStorage.getItem("volume") ?? "100"
      props.videoRef.current!.volume = Number(localStorage.getItem("volume")) / 100
    }

    // load mute status from LocalStrage
    if (localStorage.getItem("mute")) {
      if (localStorage.getItem("mute") == "true") {
        setIsMute(true)
        controlVolumeSliderRef.current!.value = "0"
        props.videoRef.current!.volume = 0
      }
    }

  }, [])

  useEffect(() => {
    let moveTimer: number

    const onVideoMouseMove = () => {
      window.clearTimeout(moveTimer);
      setIsCursorOutVideo(false)
      moveTimer = window.setTimeout(() => {
        setIsCursorOutVideo(true)
      }, 2000)
    }

    const onVideoMouseOut = () => {
      window.clearTimeout(moveTimer);
      setIsCursorOutVideo(true)
    }

    controlContainerRef.current?.addEventListener("mousemove", onVideoMouseMove)
    controlContainerRef.current?.addEventListener("mouseleave", onVideoMouseOut)

    return () => {
      controlContainerRef.current?.removeEventListener("mousemove", onVideoMouseMove)
      controlContainerRef.current?.removeEventListener("mouseleave", onVideoMouseOut)
    };
  }, [])

  const getVideoMaxTime = () => {
    if (!isNaN(props.videoRef.current?.duration!) && props.videoRef.current?.duration) {
      return props.videoRef.current?.duration
    } else {
      return 0
    }
  }

  const switchPlayStop = useCallback(() => {
    if (isPlaying) {
      props.videoRef.current?.pause()
      setIsPlaying(false)
    } else {
      props.videoRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const onChangeSlider = (e: any) => {
    if (!props.videoRef.current) return;
    props.videoRef.current.currentTime = e.target.value
    setVideoCurrentTime(e.target.value)
  }

  const onMouseDownSeekbar = () => {
    props.videoRef.current?.pause()
  }

  const onMouseUpSeekbar = () => {
    if (isPlaying) {
      props.videoRef.current?.play().catch(error => {
        console.log("e:", error)
      })
    }
  }

  const getVideoTimeStr = () => {
    if (isNaN(props.videoRef.current?.currentTime!) || isNaN(props.videoRef.current?.duration!)) {
      return "00:00 / 00:00"
    }
    let nowS = Math.round(props.videoRef.current?.currentTime!)
    let nowM = Math.floor(nowS / 60)
    nowS %= 60
    let nowH = Math.floor(nowM / 60)
    nowM %= 60

    let maxS = Math.round(props.videoRef.current?.duration!)
    let maxM = Math.floor(maxS / 60)
    maxS %= 60
    let maxH = Math.floor(maxM / 60)
    maxM %= 60

    let str = "";
    str += nowH ? `${nowH}:` : ""
    str += `${("00" + nowM).slice(-2)}:`
    str += ("00" + nowS).slice(-2)
    str += " / "
    str += maxH ? `${maxH}:` : ""
    str += `${("00" + maxM).slice(-2)}:`
    str += ("00" + maxS).slice(-2)

    return str
  }

  const onVideoTimeUpdate = useCallback(() => {
    setDisplayTime(getVideoTimeStr())
    setVideoCurrentTime(props.videoRef.current?.currentTime!)
  }, [])

  const onClickBack = useCallback(() => {
    if (!props.videoRef.current) return;
    if (props.videoRef.current!.currentTime - 5 < 0) {
      props.videoRef.current!.currentTime = 0
    } else {
      props.videoRef.current!.currentTime -= 5
    }
    onVideoTimeUpdate()
  }, [onVideoTimeUpdate])

  const onClickForward = useCallback(() => {
    if (!props.videoRef.current) return;
    if (props.videoRef.current!.currentTime + 5 > props.videoRef.current.duration) {
      props.videoRef.current!.currentTime = props.videoRef.current.duration
    } else {
      props.videoRef.current!.currentTime += 5
    }
    onVideoTimeUpdate()
  }, [onVideoTimeUpdate])

  const onClickMute = useCallback(() => {
    if (!volume) return;
    if (isMute) {
      setIsMute(false)
      localStorage.setItem("mute", "false")
      controlVolumeSliderRef.current!.value = volume.toString()
      props.videoRef.current!.volume = volume / 100
    } else{
      setIsMute(true)
      localStorage.setItem("mute", "true")
      controlVolumeSliderRef.current!.value = "0"
      props.videoRef.current!.volume = 0
    }
  }, [volume, isMute, controlVolumeSliderRef, props.videoRef])

  const onChangeVolume = (e: any) => {
    if (e.target.value !== 0) {
      setIsMute(false)
      localStorage.setItem("mute", "false")
    }
    setVolume(e.target.value)
    localStorage.setItem("volume", e.target.value)
    props.videoRef.current!.volume = e.target.value / 100
  }

  const onClickFull = useCallback(() => {
    if (isFullScreen) {
      document.exitFullscreen().then(() => {
        setIsfullScreen(false)
      })
    } else {
      props.videoContainerRef.current?.requestFullscreen().then(() => {
        setIsfullScreen(true)
      })
    }
  }, [isFullScreen, props.videoContainerRef])

  const onControlsMousemove = () => {
    setIsCursorOnControls(true);
  }

  const onControlsMouseleave = () => {
    setIsCursorOnControls(false);
  }

  const VideoControlButton = ({children, className, onClick}: {children: ReactNode, className?: string, onClick?: ReactEventHandler<HTMLButtonElement>}) => {
    return(
      <button className={`${css.video_control_button} ${className ?? ""}`} onClick={onClick}>
        <div>
          {children}
        </div>
      </button>
    )
  }

  const ControlPlayStop = useMemo(() => {
    return(
      <VideoControlButton onClick={switchPlayStop}>
        {(() => {
          if (isPlaying) {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>
          } else {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          }
        })()}
      </VideoControlButton>
    )
  }, [isPlaying, switchPlayStop])

  const ControlBack = useMemo(() => {
    return (
      <VideoControlButton className={css.video_control_skip} onClick={onClickBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" /></svg>
      </VideoControlButton>
    )
  }, [onClickBack])

  const ControlForward = useMemo(() => {
    return (
      <VideoControlButton className={css.video_control_skip} onClick={onClickForward}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.5 3C14.15 3 16.55 4 18.4 5.6L21 3V10H14L16.62 7.38C15.23 6.22 13.46 5.5 11.5 5.5C7.96 5.5 4.95 7.81 3.9 11L1.53 10.22C2.92 6.03 6.85 3 11.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" /></svg>
      </VideoControlButton>
    )
  }, [onClickForward])


  const ControlMute = useMemo(() => {
    return (
      <VideoControlButton className={css.video_control_mute} onClick={onClickMute}>
        {(() => {
          if (volume != 0 && !isMute) {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          } else {
            return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" /></svg>
          }
        })()}
      </VideoControlButton>
    )
  }, [volume, isMute, onClickMute])

  const ControlFullScreen = useMemo(() => {
    return (
      <VideoControlButton onClick={onClickFull}>
        {(() => {
          if (isFullScreen) {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
          } else {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
          }
        })()}
      </VideoControlButton>
    )
  }, [isFullScreen, onClickFull])

  return(
    <div className={`${css.control_container} ${isCursorOutVideo && !isCursorOnControls && isPlaying ? css.cursor_hide: ""}`} ref={controlContainerRef} style={{width: `${videoWidth}px`, height: `${videoHeight}px`}}>
      <div className={css.video_main_aria} onClick={switchPlayStop}></div>
      <div className={css.video_bottom_control_aria} onMouseMove={onControlsMousemove} onMouseLeave={onControlsMouseleave}>
        <div className={`${css.video_seekbar} ${isCursorOutVideo && !isCursorOnControls && isPlaying ? css.hide: ""}`}>
          <input className={css.video_seekbar_slider} type="range" max={getVideoMaxTime()} onChange={onChangeSlider} onMouseDown={onMouseDownSeekbar} onMouseUp={onMouseUpSeekbar}></input>
          <div className={css.video_seekbar_base}></div>
          <div className={css.video_seekbar_played} style={{width: `${videoCurrentTime / getVideoMaxTime() * 100}%`}}></div>
          <div className={css.video_seekbar_thumb_container} style={{width: `${videoCurrentTime / getVideoMaxTime() * 100}%`}}>
            <div className={css.video_seekbar_thumb}></div>
          </div>
        </div>
        <div className={`${css.video_controls} ${isCursorOutVideo && !isCursorOnControls && isPlaying ? css.hide: ""}`}>
          <div className={css.video_left_controls}>
            {ControlPlayStop}
            {ControlBack}
            {ControlForward}
            <div className={css.video_volume_controller}>
              {ControlMute}
              <div className={css.video_control_volume}>
                <input className={css.video_control_volume_slider} ref={controlVolumeSliderRef} onChange={onChangeVolume} type="range" max="100"></input>
                <div className={css.video_control_volume_base}></div>
                <div className={css.video_control_volume_now} style={{width: `${isMute ? 0 : volume}%`}}></div>
              </div>
            </div>
            <div className={css.video_time_display}>
              <span>{displayTime}</span>
            </div>
          </div>
          <div className={css.video_right_controls}>
            {ControlFullScreen}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoControl
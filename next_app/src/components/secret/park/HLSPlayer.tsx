import { ReactEventHandler, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js"
import Script from "next/script";
import css from "./HLSPlayer.module.scss"

const VideoControlButton = ({children, className, onClick}: {children: ReactNode, className?: string, onClick?: ReactEventHandler<HTMLButtonElement>}) => {
  return(
    <button className={`${css.video_control_button} ${className ?? ""}`} onClick={onClick}>
      <div>
        {children}
      </div>
    </button>
  )
}

type Props = {
  src: string;
};

const HLSPlayer = (props: Props) => {
  const isSupportBrowser = useMemo(() => Hls.isSupported(), [])
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const seekbarSliderRef = useRef<HTMLInputElement>(null)

  const [isHideControls, setIsHideControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullScreen, setIsfullScreen] = useState(false)
  const [onControlsCursor, setOnControlsCursor] = useState(false)
  const [displayTime, setDisplayTime] = useState("0:00 / 0:00")
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)


  useEffect(() => {

    console.log(isSupportBrowser)
    var hls = new Hls()
    hls.attachMedia(videoRef.current!)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("load")
      hls.loadSource(props.src)
    });
    //hls.loadSource(props.src)
    //hls.on(Hls.Events.BUFFER_APPENDED, () => {console.log("appended")})
/*
    window.addEventListener("error", function (e: ErrorEvent) {
      //alert("Error occurred: " + e.error.message);
      console.log(e.error.message.toString());
      console.log((e.error.message.toString() as string).indexOf("Failed to read the"))
      if (!(e.error.message.toString() as string).indexOf("Failed to read the")) {
        console.log("soudane")
        //hls.attachMedia(videoRef.current!)
        //hls.startLoad();
        //hls.detachMedia()
        //hls.recoverMediaError();
      }
      return false;
    })
*/

    return () => {
      hls.removeAllListeners()
      hls.stopLoad()
    }
  }, [])

  useEffect(() => {
    if (seekbarSliderRef.current && videoRef.current?.currentTime != undefined) {
      seekbarSliderRef.current!.value = videoRef.current?.currentTime.toString()
      setVideoCurrentTime(videoRef.current?.currentTime)
      console.log(videoCurrentTime / getVideoMaxTime() * seekbarSliderRef.current?.clientWidth!, seekbarSliderRef.current?.clientWidth!)

      //console.log(videoRef.current?.currentTime)
    }
  }, [videoRef.current?.currentTime])




  const ControlPlayStop = () => {
    if (isPlaying) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>
    } else {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    }
  }

  const ControlFullScrenn = () => {
    if (isFullScreen) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
    } else {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
    }
  }

  const onClickPlayStop = () => {
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
      // setIsHideControls(false)
    } else {
      videoRef.current?.play()
      setIsPlaying(true)
    }
  }

  const onClickBack = () => {
    if (!videoRef.current) return;
    if (videoRef.current!.currentTime - 5 < 0) {
      videoRef.current!.currentTime = 0
    } else {
      videoRef.current!.currentTime -= 5
    }
    onVideoTimeUpdate()
  }

  const onClickForward = () => {
    if (!videoRef.current) return;
    if (videoRef.current!.currentTime + 5 > videoRef.current.duration) {
      videoRef.current!.currentTime = videoRef.current.duration
    } else {
      videoRef.current!.currentTime += 5
    }
    onVideoTimeUpdate()
  }

  const getVideoMaxTime = () => {
    if (!isNaN(videoRef.current?.duration!) && videoRef.current?.duration) {
      return videoRef.current?.duration
    } else {
      return 0
    }
  }

  const getVideoCurrentTime = () => {
    if (!isNaN(videoRef.current?.currentTime!) && videoRef.current?.currentTime) {
      return videoRef.current?.currentTime
    } else {
      return 0
    }
  }

  const getVideoTimeStr = () => {
    if (isNaN(videoRef.current?.currentTime!) || isNaN(videoRef.current?.duration!)) {
      return "00:00 / 00:00"
    }
    let nowS = Math.round(videoRef.current?.currentTime!)
    let nowM = Math.floor(nowS / 60)
    nowS %= 60
    let nowH = Math.floor(nowM / 60)
    nowM %= 60

    let maxS = Math.round(videoRef.current?.duration!)
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

  const onVideoTimeUpdate = () => {
    setDisplayTime(getVideoTimeStr())
  }

  const onClickFull = () => {
    if (isFullScreen) {
      document.exitFullscreen().then(() => {
        setIsfullScreen(false)
      })
    } else {
      videoContainerRef.current?.requestFullscreen().then(() => {
        setIsfullScreen(true)
      })
    }
  }

  useEffect(() => {
    let moveTimer: number

    const onVideoMouseMove = () => {
      window.clearTimeout(moveTimer);
      setIsHideControls(false)
      moveTimer = window.setTimeout(() => {
        setIsHideControls(true)
      }, 2000)
    }

    const onVideoMouseOut = () => {
      window.clearTimeout(moveTimer);
      setIsHideControls(true)
    }

    videoWrapperRef.current?.addEventListener("mousemove", onVideoMouseMove)
    videoWrapperRef.current?.addEventListener("mouseout", onVideoMouseOut)

    return () => {
      videoWrapperRef.current?.removeEventListener("mousemove", onVideoMouseMove)
      videoWrapperRef.current?.removeEventListener("mouseout", onVideoMouseOut)
    };
  }, [])

  const onControlsMousemove = () => {
    setOnControlsCursor(true);
    //console.log("c: true")
  }

  const onControlsMouseleave = () => {
    setOnControlsCursor(false);
    //console.log("c: false")
  }

  const onChangeSlider = (e: any) => {
    //videoRef.current?.currentTime = e.value
    if (!videoRef.current) return;
    videoRef.current.currentTime = e.target.value
    setVideoCurrentTime(e.target.value)
    //console.log(e.target.value)
    //console.log("change", e.target.value)
  }

  const onMouseDownSeekbar = () => {
    videoRef.current?.pause()
    //setIsPlaying(false)
  }

  const onMouseUpSeekbar = () => {
    if (isPlaying) {
      videoRef.current?.play().catch(error => {
        console.log("e:", error)
      })
    }
    //setIsPlaying(true)
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/hls.js@1.1.5" strategy="beforeInteractive"/>
      <div className={css.video_container} ref={videoContainerRef}>
        <div className={`${css.video_wrapper} ${isHideControls && !onControlsCursor && isPlaying ? css.cursor_hide: ""}`} ref={videoWrapperRef}>
          <video className={css.video} ref={videoRef} onTimeUpdate={onVideoTimeUpdate} onLoadedMetadata={onVideoTimeUpdate} onClick={onClickPlayStop}></video>
          <div className={`${css.video_control_container} ${isHideControls && !onControlsCursor &&isPlaying ? css.hide: ""}`} onMouseMove={onControlsMousemove} onMouseLeave={onControlsMouseleave}>
            <div className={css.video_seekbar}>
              <input className={css.video_seekbar_slider} type="range" ref={seekbarSliderRef}  max={getVideoMaxTime()} onChange={onChangeSlider} onMouseDown={onMouseDownSeekbar} onMouseUp={onMouseUpSeekbar}></input>
              <div className={css.video_seekbar_base}></div>
              <div className={css.video_seekbar_played} style={{width: `${videoCurrentTime / getVideoMaxTime() * 100}%`}}></div>
              <div className={css.video_seekbar_thumb_container} style={{width: `${videoCurrentTime / getVideoMaxTime() * 100}%`}}>
                <div className={css.video_seekbar_thumb}></div>
              </div>
            </div>
            <div className={`${css.video_controls}`}>
              <div className={css.video_left_controls}>
                <VideoControlButton onClick={onClickPlayStop}>
                  {ControlPlayStop()}
                </VideoControlButton>
                <VideoControlButton className={css.video_control_skip} onClick={onClickBack}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" /></svg>
                </VideoControlButton>
                <VideoControlButton className={css.video_control_skip} onClick={onClickForward}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.5 3C14.15 3 16.55 4 18.4 5.6L21 3V10H14L16.62 7.38C15.23 6.22 13.46 5.5 11.5 5.5C7.96 5.5 4.95 7.81 3.9 11L1.53 10.22C2.92 6.03 6.85 3 11.5 3M9 12H15V14H11V16H13C14.11 16 15 16.9 15 18V20C15 21.11 14.11 22 13 22H9V20H13V18H9V12Z" /></svg>
                </VideoControlButton>
                <div className={css.video_time_display}>
                  <span>{displayTime}</span>
                </div>
              </div>
              <div className={css.video_right_controls}>
                <VideoControlButton onClick={onClickFull}>
                  {ControlFullScrenn()}
                </VideoControlButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HLSPlayer;
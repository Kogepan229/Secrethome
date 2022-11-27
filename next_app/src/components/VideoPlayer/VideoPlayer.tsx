import { useEffect, useMemo, useRef } from "react";
import { browserName, detectOS, Browser} from 'detect-browser';
import Hls from "hls.js";
import css from "./VideoPlayer.module.scss"
import VideoControl from "./VideoControl"

type Props = {
  src: string;
};

const VideoPlayer = (props: Props) => {
  const isSupportBrowser = useMemo(() => Hls.isSupported(), [])
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log(isSupportBrowser)
    if (!isSupportBrowser) {
      return;
    }

    var hls = new Hls()
    hls.attachMedia(videoRef.current!)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("load")
      hls.loadSource(props.src)
    });

    return () => {
      hls.removeAllListeners()
      hls.stopLoad()
    }
  }, [])

  if (browserName(window.navigator.userAgent) == "ios") {
    return (
      <div className={css.video_container}  ref={videoContainerRef}>
        <div className={css.video_wrapper}>
          <video className={css.video} src={props.src} poster={props.src.replace("m3u8", "webp")} controls playsInline></video>
        </div>
      </div>
    )
  }

  return (
    <div className={css.video_container}  ref={videoContainerRef}>
      <div className={css.video_wrapper}>
        <video className={css.video} ref={videoRef}></video>
        <VideoControl videoRef={videoRef} videoContainerRef={videoContainerRef}></VideoControl>
      </div>
    </div>
  )
}

export default VideoPlayer
import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js"
import Script from "next/script";
import css from "./HLSPlayer.module.scss"

type Props = {
  src: string;
};

const HLSPlayer = (props: Props) => {
  const isSupportBrowser = useMemo(() => Hls.isSupported(), [])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log(isSupportBrowser)
    var hls = new Hls()
    hls.loadSource(props.src)
    hls.attachMedia(videoRef.current!)
  }, [])


  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/hls.js@1.1.5" strategy="beforeInteractive"/>
      <video ref={videoRef} className={css.video} controls></video>
    </>
  );
};

export default HLSPlayer;
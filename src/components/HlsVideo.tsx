'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import Hls, { type HlsConfig } from 'hls.js'

export interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string // HLS manifest URL
  hlsConfig?: Partial<HlsConfig>
}

const HlsVideo = React.forwardRef<HTMLVideoElement, HlsVideoProps>(({ src, hlsConfig, ...props }, forwardedRef) => {
  const innerRef = useRef<HTMLVideoElement>(null)
  const videoRef = (forwardedRef as React.RefObject<HTMLVideoElement>) ?? innerRef

  const mergedConfig = useMemo<Partial<HlsConfig>>(
    () => ({
      // Performance-friendly defaults
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 30,
      ...hlsConfig,
    }),
    [hlsConfig]
  )

  useEffect(() => {
    const video = videoRef.current || innerRef.current
    if (!video) return

    // Safari supports native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }

    if (!Hls.isSupported()) {
      // If HLS is not supported at all, do nothing.
      return
    }

    const hls = new Hls(mergedConfig)
    hls.loadSource(src)
    hls.attachMedia(video)

    const onError = (_event: unknown, data: any) => {
      if (!data?.fatal) return
      // Try to recover from fatal errors where possible
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad()
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError()
      } else {
        hls.destroy()
      }
    }

    hls.on(Hls.Events.ERROR, onError)

    return () => {
      try {
        hls.destroy()
      } catch {}
    }
  }, [src, mergedConfig])

  return <video ref={(node) => {
    // Support both internal ref and forwarded ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(innerRef as any).current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef && typeof forwardedRef === 'object') (forwardedRef as any).current = node
  }} {...props} />
})

HlsVideo.displayName = 'HlsVideo'

export default HlsVideo



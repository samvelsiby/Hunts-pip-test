'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import Hls, { type HlsConfig } from 'hls.js'

export interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string // HLS manifest URL
  hlsConfig?: Partial<HlsConfig>
}

export default function HlsVideo({ src, hlsConfig, ...props }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const mergedConfig = useMemo<Partial<HlsConfig>>(
    () => ({
      // Optimized performance settings
      enableWorker: true,
      lowLatencyMode: false,
      
      // Buffer settings for smooth playback
      backBufferLength: 60, // Increased back buffer
      maxBufferLength: 60,  // Increased forward buffer
      maxBufferSize: 60 * 1000 * 1000, // 60MB buffer size
      maxBufferHole: 0.5,   // Handle buffer holes better
      
      // Fragment loading optimization  
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 6,
      fragLoadingRetryDelay: 500,
      
      // Level selection for adaptive bitrate
      startLevel: -1, // Auto-select best quality
      testBandwidth: true,
      abrEwmaDefaultEstimate: 1000000, // 1Mbps initial estimate
      
      // Additional optimizations
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 3,
      liveSyncDurationCount: 3,
      
      ...hlsConfig,
    }),
    [hlsConfig]
  )

  useEffect(() => {
    const video = videoRef.current
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

  return <video ref={videoRef} {...props} />
}



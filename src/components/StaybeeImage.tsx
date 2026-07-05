import type React from 'react'
import { useEffect, useRef, useState } from 'react'

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  maxRetries?: number
  retryDelayMs?: number
}

function getExpectedAspectFromSrc(src: string) {
  try {
    const url = new URL(src)
    const size = url.searchParams.get('image_size')
    if (!size) return null

    if (size.startsWith('square')) return 1
    if (size === 'landscape_16_9') return 16 / 9
    if (size === 'landscape_4_3') return 4 / 3
    if (size === 'portrait_4_3') return 3 / 4
    if (size === 'portrait_16_9') return 9 / 16
    return null
  } catch {
    return null
  }
}

function isGeneratingPlaceholder(img: HTMLImageElement, expectedAspect: number | null) {
  if (!expectedAspect) return img.naturalWidth === img.naturalHeight
  const actualAspect = img.naturalWidth / img.naturalHeight
  return Math.abs(actualAspect - expectedAspect) > 0.2
}

export default function StaybeeImage({
  src,
  alt,
  className,
  maxRetries = 8,
  retryDelayMs = 1200,
  ...props
}: Props) {
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const retryTimerRef = useRef<number | null>(null)
  const expectedAspect = src ? getExpectedAspectFromSrc(src) : null

  useEffect(() => {
    setFailed(false)
    setAttempt(0)

    if (!src) return

    return () => {
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [src])

  const { onLoad, onError, ...imgProps } = props

  const srcWithRetry =
    src && !failed
      ? `${src}${src.includes('?') ? '&' : '?'}staybee_retry=${attempt}`
      : src ?? undefined

  return (
    <img
      {...imgProps}
      src={srcWithRetry}
      alt={alt}
      className={className}
      loading={imgProps.loading ?? 'lazy'}
      onLoad={(e) => {
        onLoad?.(e)
        if (failed || !src) return

        const img = e.currentTarget
        const generating = isGeneratingPlaceholder(img, expectedAspect)
        if (!generating) return

        if (attempt < maxRetries) {
          if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current)
          retryTimerRef.current = window.setTimeout(() => {
            setAttempt((v) => v + 1)
          }, retryDelayMs)
          return
        }

        setFailed(true)
      }}
      onError={(e) => {
        onError?.(e)
        if (failed || !src) return

        if (attempt < maxRetries) {
          if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current)
          retryTimerRef.current = window.setTimeout(() => {
            setAttempt((v) => v + 1)
          }, retryDelayMs)
          return
        }

        setFailed(true)
      }}
    />
  )
}


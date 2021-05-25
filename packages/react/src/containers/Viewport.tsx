import React, { useEffect, useRef, useState } from 'react'
import { usePrefix, useViewport } from '../hooks'
import { AuxToolWidget, EmptyWidget } from '../widgets'
import { requestIdle } from '@designable/shared'
import cls from 'classnames'
export interface IViewportProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  placeholder?: React.ReactNode
}

export const Viewport: React.FC<IViewportProps> = ({
  placeholder,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const prefix = usePrefix('viewport')
  const viewport = useViewport()
  const ref = useRef<HTMLDivElement>()
  const isFrameRef = useRef(false)
  useEffect(() => {
    const frameElement = ref.current.querySelector('iframe')
    if (!viewport) return
    if (frameElement) {
      frameElement.addEventListener('load', () => {
        viewport.onMount(frameElement, frameElement.contentWindow)
        requestIdle(() => {
          isFrameRef.current = true
          setLoaded(true)
        })
      })
    } else {
      viewport.onMount(ref.current, window)
      requestIdle(() => {
        isFrameRef.current = false
        setLoaded(true)
      })
    }
    return () => {
      viewport.onUnmount()
    }
  }, [])
  return (
    <div
      {...props}
      ref={ref}
      className={cls(prefix, props.className)}
      style={{
        opacity: !loaded ? 0 : 1,
        overflow: isFrameRef.current ? 'hidden' : 'overlay',
        ...props.style,
      }}
    >
      {props.children}
      <AuxToolWidget />
      <EmptyWidget>{placeholder}</EmptyWidget>
    </div>
  )
}
import { type Key, type RefObject, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition } from 'react-transition-group'

export default function CollapseTransition(props: {
  children: JSX.Element
  in?: boolean
  key?: Key
  classNames?: string
  timeout?: number
  nodeRef: RefObject<HTMLElement>
}) {
  useEffect(() => {
    // @ts-expect-error View Transition API is not yet in the DOM typings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!document.startViewTransition) return
    // @ts-expect-error View Transition API is not yet in the DOM typings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    document.startViewTransition(() => {
      flushSync(() => {
        if (props.in) {
          props.nodeRef.current?.style.removeProperty('display')
        } else {
          props.nodeRef.current?.style.setProperty('display', 'none')
        }
      })
    })
  }, [props.in, props.nodeRef])

  // @ts-expect-error View Transition API is not yet in the DOM typings
  if (document.startViewTransition) {
    return props.in ? props.children : null
  } else {
    return (
      <CSSTransition
        in={props.in}
        key={props.key}
        timeout={props.timeout ?? 300}
        classNames={props.classNames ?? 'collapse'}
        unmountOnExit={!props.key}
        onEnter={(): void => {
          props.nodeRef.current?.style.setProperty(
            '--transition-height',
            `${props.nodeRef.current.scrollHeight}px`,
          )
        }}
        onExit={(): void => {
          props.nodeRef.current?.style.setProperty(
            '--transition-height',
            `${props.nodeRef.current.scrollHeight}px`,
          )
          return
        }}
        nodeRef={props.nodeRef}
      >
        {props.children}
      </CSSTransition>
    )
  }
}

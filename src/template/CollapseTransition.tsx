import { ReactNode, Key, RefObject } from 'react'
import { CSSTransition } from 'react-transition-group'

export default function CollapseTransition(props: {
  children?: ReactNode
  in?: boolean
  key?: Key
  classNames?: string
  timeout?: number
  nodeRef: RefObject<HTMLElement>
}) {
  return (
    <CSSTransition
      in={props.in}
      key={props.key}
      timeout={props.timeout ?? 300}
      classNames={props.classNames ?? 'collapse'}
      unmountOnExit={!props.key}
      onEnter={() => {
        props.nodeRef.current?.style.setProperty(
          '--transition-height',
          `${props.nodeRef.current.scrollHeight}px`
        )
      }}
      onExit={() => {
        props.nodeRef.current?.style.setProperty(
          '--transition-height',
          `${props.nodeRef.current.scrollHeight}px`
        )
      }}
      nodeRef={props.nodeRef}
    >
      {props.children}
    </CSSTransition>
  )
}

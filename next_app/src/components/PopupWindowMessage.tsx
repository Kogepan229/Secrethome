import { ReactNode } from 'react'
import css from './PopupWindowMessage.module.scss'

type Props = {
  children?: ReactNode
  isShow: boolean
  message: string
  buttonText: string
  buttonCallback: () => void
}

const PopupWindowMessage = (props: Props) => {
  if (!props.isShow) {
    return null
  }

  return (
    <>
      <div className={css.overlay}></div>
      <div className={css.container}>
        <div className={css.message_aria}>
          <p className={css.message}>{props.message}</p>
        </div>
        <button className={css.button} onClick={props.buttonCallback}>
          {props.buttonText}
        </button>
      </div>
    </>
  )
}

export default PopupWindowMessage

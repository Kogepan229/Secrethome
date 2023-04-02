import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import css from './SimpleButton.module.scss'

const SimpleButton = React.forwardRef<HTMLButtonElement, DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>(
  function _SimpleButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref) {
    return <button {...props} className={`${css.button} ${props.className ?? ''}`} ref={ref}></button>
  }
)

export default SimpleButton

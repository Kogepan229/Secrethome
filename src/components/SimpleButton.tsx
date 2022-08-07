import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import css from "./SimpleButton.module.scss"
/*
const SimpleButton = (props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return <button {...props} className={`${css.button} ${props.className ?? ""}`}></button>
}
*/
const SimpleButton = React.forwardRef<HTMLButtonElement, DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>((props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref) => {
  return <button {...props} className={`${css.button} ${props.className ?? ""}`} ref={ref}></button>
})

export default SimpleButton
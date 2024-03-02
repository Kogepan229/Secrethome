'use client'
import { useMemo, useState } from 'react'
import css from './FormParts.module.scss'

const FormPartTextArea = ({
  title,
  name,
  text,
  setText,
}: {
  title: string
  name: string
  text: string
  setText: React.Dispatch<React.SetStateAction<string>>
}) => {
  const handleChangeText = (event: any) => {
    setText(event.target.value)
  }

  return (
    <div>
      <h4 className={css.item_header}>{title}</h4>
      <textarea spellCheck="false" autoComplete="off" name={name} value={text} className={css.input_textarea} onChange={handleChangeText} />
    </div>
  )
}

export const useFormPartTextArea = ({ title, name, initial }: { title: string; name: string; initial?: string }): [JSX.Element, string] => {
  const [text, setText] = useState(initial ?? '')

  const formTextArea = useMemo(() => <FormPartTextArea title={title} name={name} text={text} setText={setText} />, [text, setText])

  return [formTextArea, text]
}

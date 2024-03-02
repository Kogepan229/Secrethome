'use client'
import { useCallback, useMemo, useState } from 'react'
import css from './FormParts.module.scss'

const FormPartText = ({
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
  const handleChangeText = useCallback((event: any) => {
    setText(event.target.value)
  }, [])

  return (
    <div>
      <h4 className={css.item_header}>{title}</h4>
      <input
        spellCheck="false"
        autoComplete="off"
        type={'text'}
        name={name}
        value={text}
        className={css.input_text}
        onChange={handleChangeText}
      ></input>
    </div>
  )
}

export const useFormPartText = ({ title, name, initial }: { title: string; name: string; initial?: string }): [JSX.Element, string] => {
  const [text, setText] = useState(initial ?? '')

  const formText = useMemo(() => <FormPartText title={title} name={name} text={text} setText={setText} />, [title, name, text, setText])

  return [formText, text]
}

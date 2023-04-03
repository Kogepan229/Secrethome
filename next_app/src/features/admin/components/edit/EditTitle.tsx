'use client'
import { useCallback, useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'

const EditTitle = ({ title, setTitle }: { title: string; setTitle: React.Dispatch<React.SetStateAction<string>> }) => {
  console.log('EditTitle')
  const handleChangeTitle = useCallback((event: any) => {
    setTitle(event.target.value)
  }, [])

  return (
    <div>
      <p>タイトル</p>
      <input
        spellCheck="false"
        autoComplete="off"
        type={'text'}
        name={'title'}
        value={title}
        className={css.input_title}
        onChange={handleChangeTitle}
      ></input>
    </div>
  )
}

export const useEditTitle = ({ title }: { title: string }) => {
  const [_title, setTitle] = useState(title ?? '')

  const editTitle = useMemo(() => <EditTitle title={_title} setTitle={setTitle} />, [_title, setTitle])

  return {
    EditTitle: editTitle,
    title: _title,
  }
}

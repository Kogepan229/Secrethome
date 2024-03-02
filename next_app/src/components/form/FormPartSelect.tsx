'use client'
import { useCallback, useMemo, useState } from 'react'
import css from './FormParts.module.scss'

const FormPartSelect = ({
  title,
  name,
  options,
  selected,
  setSelected,
}: {
  title: string
  name: string
  options: { value: string; name: string }[]
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
}) => {
  const handleChangeSelected = useCallback((event: any) => {
    setSelected(event.target.value)
  }, [])

  const optionList = options.map(v => {
    return (
      <option value={v.value} key={v.value}>
        {v.name}
      </option>
    )
  })

  return (
    <div>
      <h4 className={css.item_header}>{title}</h4>
      <select name={name} value={selected} className={css.input_select} onChange={handleChangeSelected}>
        {optionList}
      </select>
    </div>
  )
}

export const useFormPartSelect = ({
  title,
  name,
  options,
  initial,
}: {
  title: string
  name: string
  options: { value: string; name: string }[]
  initial?: string
}): [JSX.Element, string] => {
  const [selected, setSelected] = useState(initial ?? '')

  const formText = useMemo(
    () => <FormPartSelect title={title} name={name} options={options} selected={selected} setSelected={setSelected} />,
    [title, name, selected, setSelected]
  )

  return [formText, selected]
}

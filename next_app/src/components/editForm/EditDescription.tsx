'use client'
import { useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'

const EditDescription = ({
  description,
  setDescription,
}: {
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
}) => {
  const handleChangeDescription = (event: any) => {
    setDescription(event.target.value)
  }

  return (
    <div>
      <h4 className={css.item_header}>概要</h4>
      <textarea
        spellCheck="false"
        autoComplete="off"
        name={'description'}
        value={description}
        className={css.input_description}
        onChange={handleChangeDescription}
      />
    </div>
  )
}

export const useEditDescription = ({ description }: { description: string }) => {
  const [_description, setDescription] = useState(description ?? '')

  const editDescription = useMemo(
    () => <EditDescription description={_description} setDescription={setDescription} />,
    [_description, setDescription]
  )

  return {
    EditDescription: editDescription,
    description: _description,
  }
}

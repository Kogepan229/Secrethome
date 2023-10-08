'use client'
import { useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'
import { TagData } from 'util/secret/park/tags'
import TagModal from './TagModal'
import SimpleButton from 'components/SimpleButton'

const EditTags = ({
  selectedTagList,
  setSelectedTagList,
}: {
  selectedTagList: TagData[]
  setSelectedTagList: React.Dispatch<React.SetStateAction<TagData[]>>
}) => {
  const [isOpenedTagModal, setIsOpenedTagModal] = useState(false)

  const addTag = (tag: TagData) => {
    setSelectedTagList(prev => [...prev, tag])
  }

  const TagItem = (tagProps: { id: string; name: string }) => {
    const onClickTag = () => {
      setSelectedTagList(selectedTagList.filter(value => value.id != tagProps.id))
    }

    return (
      <div className={css.tag} onClick={onClickTag}>
        {tagProps.name}
      </div>
    )
  }

  const TagItems = selectedTagList.map(value => {
    return <TagItem id={value.id} name={value.name} key={value.id} />
  })

  return (
    <div>
      <h4 className={css.item_header}>タグ</h4>
      <SimpleButton type="button" className={css.string_button} onClick={() => setIsOpenedTagModal(!isOpenedTagModal)}>
        {isOpenedTagModal ? '閉じる' : 'タグを追加'}
      </SimpleButton>
      <div className={css.tags_container}>{TagItems}</div>
      <TagModal
        isShow={isOpenedTagModal}
        closeCallback={() => setIsOpenedTagModal(false)}
        selectTagCallback={addTag}
        excludeTagIDList={selectedTagList.map(value => value.id)}
      />
    </div>
  )
}

export const useEditTags = ({ selectedTagList }: { selectedTagList: TagData[] }) => {
  const [_selectedTagList, setSelectedTags] = useState<TagData[]>(selectedTagList)

  const editTags = useMemo(() => <EditTags selectedTagList={_selectedTagList} setSelectedTagList={setSelectedTags} />, [_selectedTagList])

  return {
    EditTags: editTags,
    selectedTagList: _selectedTagList,
  }
}

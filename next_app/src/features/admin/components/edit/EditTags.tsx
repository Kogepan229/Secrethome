'use client'
import { useMemo, useState } from 'react'
import css from './EditContentForm.module.scss'
import { TagData } from 'util/secret/park/tags'
import TagModal from './TagModal'

const EditTags = ({
  selectedTagList,
  setSelectedTagList,
}: {
  selectedTagList: TagData[]
  setSelectedTagList: React.Dispatch<React.SetStateAction<TagData[]>>
}) => {
  console.log('EditTags')
  const [isOpenedTagModal, setIsOpenedTagModal] = useState(false)

  const addTag = (tag: TagData) => {
    setSelectedTagList(prev => [...prev, tag])
    //SetIsOpenedTagModal(false)
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
      <p>タグ</p>
      <button type="button" onClick={() => setIsOpenedTagModal(true)}>
        タグを追加
      </button>
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

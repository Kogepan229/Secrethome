"use client"
import css from './TagModal.module.scss'
import { TagData } from 'util/secret/park/tags'
import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'

type Props = {
  isShow: boolean
  closeCallback: () => void
  selectTagCallback: (tag: TagData) => void
  tagList: TagData[]
  excludeTagIDList?: string[]
}

const TagModal = (props: Props) => {
  const [any, forceUpdate] = useReducer(num => num + 1, 0)
  const [createTagValue, setCreatetagValue] = useState('')

  useEffect(() => {
    if (props.isShow) {
      /*
      props.tagList.sort((a: Tag, b: Tag) => {
        return a.priority - b.priority
      })
      forceUpdate()
      */
    }
  }, [props.isShow])

  type TagProps = {
    tag: TagData
  }

  const TagItem = (tagProps: TagProps) => {
    const onClickTagItem = () => {
      props.selectTagCallback(tagProps.tag)
    }
    return (
      <div className={css.tag} onClick={onClickTagItem}>
        {tagProps.tag.name}
      </div>
    )
  }

  const TagItems = props.tagList
    .filter(value => {
      if (props.excludeTagIDList) {
        return !props.excludeTagIDList.some(_value => {
          if (value.id === _value) {
            return true
          } else {
            return false
          }
        })
      } else {
        return true
      }
    })
    .map((item, index) => {
      return <TagItem tag={item} key={index} />
    })

  const createTag = () => {
    //console.log(createTagValue)
    if (createTagValue.trim()) {
      if (
        !props.tagList.some(value => {
          return value.name === createTagValue.trim()
        })
      ) {
        console.log('ok')
        let data = new FormData
        data.append("name", createTagValue.trim())
        axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/tag", data).then(res => {
          console.log('success')
          props.tagList.unshift({ id: res.data.id, name: createTagValue.trim() })
          setCreatetagValue('')
          forceUpdate()
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }

  if (!props.isShow) {
    return null
  }

  return (
    <div className={css.modal_container}>
      <div className={css.modal_header}>
        <div className={css.search}></div>
        <div className={css.close_button} onClick={props.closeCallback}></div>
      </div>
      <div className={css.tags_container}>
        <div className={css.create_tag}>
          <input
            className={css.create_tag_input}
            spellCheck="false"
            type="text"
            value={createTagValue}
            onChange={e => setCreatetagValue(e.target.value)}
          ></input>
          <button className={css.create_tag_button} onClick={createTag} disabled={!createTagValue}>
            追加
          </button>
        </div>
        {TagItems}
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
        <div className={css.tag}></div>
      </div>
    </div>
  )
}

export default TagModal

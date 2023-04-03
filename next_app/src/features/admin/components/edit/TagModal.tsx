'use client'
import css from './TagModal.module.scss'
import { TagData } from 'util/secret/park/tags'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import axios, { AxiosError, AxiosResponse } from 'axios'

type Props = {
  isShow: boolean
  closeCallback: () => void
  selectTagCallback: (tag: TagData) => void
  excludeTagIDList?: string[]
}

type FetchedTags = {
  tags: TagData[]
}

const fetcher = async (url: string) => {
  return await axios.get(url)
}

const TagModal = (props: Props) => {
  const [forceAny, forceUpdate] = useState(false)
  const [createTagValue, setCreatetagValue] = useState('')

  const { data, error } = useSWR<AxiosResponse<FetchedTags>, AxiosError>(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/all_tags', fetcher)
  let tags: TagData[] = data?.data.tags ?? []

  const TagItem = ({ tag }: { tag: TagData }) => {
    const onClickTagItem = () => {
      props.selectTagCallback(tag)
    }
    return (
      <div className={css.tag} onClick={onClickTagItem}>
        {tag.name}
      </div>
    )
  }

  const TagItems = useMemo(() => {
    return tags
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
  }, [tags, props.excludeTagIDList, forceAny])

  const createTag = () => {
    if (createTagValue.trim()) {
      if (
        !tags.some(value => {
          return value.name === createTagValue.trim()
        })
      ) {
        let data = new FormData()
        data.append('name', createTagValue.trim())
        axios
          .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/tag', data)
          .then(res => {
            tags.unshift({ id: res.data.id, name: createTagValue.trim() })
            setCreatetagValue('')
            forceUpdate(!forceAny)
          })
          .catch(err => {
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
      </div>
    </div>
  )
}

export default TagModal

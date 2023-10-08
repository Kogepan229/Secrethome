'use client'
import css from './TagModal.module.scss'
import { TagData } from 'util/secret/park/tags'
import { DragEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [forceAny, forceUpdate] = useState(false)
  const [createTagValue, setCreatetagValue] = useState('')
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragStartY, setDragStartY] = useState<number | null>(null)
  const [dragStartPos, setDragStartPos] = useState<DOMRect | null>(null)
  const [style, setStyle] = useState<{
    display?: string
    Visibility?: string
    top?: string
    left?: string
  }>()

  const { data, error } = useSWR<AxiosResponse<FetchedTags>, AxiosError>(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/all_tags', fetcher)
  let tags: TagData[] = data?.data.tags ?? []

  useEffect(() => {
    if (props.isShow) {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onDragEnd)
    }

    return () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onDragEnd)
    }
  })

  useEffect(() => {
    if (props.isShow) {
      if (modalRef) {
        let _style = {
          top: `${(document.documentElement.clientHeight - modalRef.current?.clientHeight!) / 2}px`,
          left: `${(document.documentElement.clientWidth - modalRef.current?.clientWidth!) / 2}px`,
        }
        setStyle(_style)
      }
    } else {
      let _style = {
        Visibility: 'hidden',
      }
      setStyle(_style)
    }
  }, [props.isShow])

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

  const onDragStart: DragEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()

    setDragStartX(e.clientX)
    setDragStartY(e.clientY)
    setDragStartPos(modalRef.current?.getBoundingClientRect()!)
  }, [])

  const onDrag = (e: MouseEvent) => {
    if (!dragStartX || !dragStartY || !dragStartPos) {
      return
    }
    e.clientX - dragStartX
    e.clientY - dragStartY

    if (modalRef) {
      let _style = {
        top: `${dragStartPos.y + (e.clientY - dragStartY)}px`,
        left: `${dragStartPos.x + (e.clientX - dragStartX)}px`,
      }
      setStyle(_style)
    }
  }

  const onDragEnd = useCallback((e: MouseEvent) => {
    setDragStartX(null)
    setDragStartY(null)
  }, [])

  if (!props.isShow) {
    return null
  }

  return (
    <div className={css.modal_container} ref={modalRef} style={style}>
      <div className={css.modal_header}>
        <div className={css.dragable} onMouseDown={onDragStart}></div>
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

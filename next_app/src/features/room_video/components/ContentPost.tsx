'use client'
import css from './ContentPost.module.scss'
import Link from 'next/link'
import SimpleButton from 'components/SimpleButton'
import { useRouter } from 'next/navigation'
import { ContentData } from '../types'

const ContentPost = ({ contentData }: { contentData: ContentData }) => {
  const router = useRouter()

  const onErrorImage = (e: any) => {
    e.target.src = `${process.env.NEXT_PUBLIC_URL}/imageSample.png`
  }

  const onClickPost = () => {
    router.push(`/park/contents/${contentData.id}`)
  }

  const Tags = contentData.tags.map(value => {
    return (
      <Link href={`/park/contents/tags/?tags=${value.id}`} key={value.id}>
        <SimpleButton className={css.content_tag} onClick={e => e.stopPropagation()}>
          {value.name}
        </SimpleButton>
      </Link>
    )
  })

  return (
    <div className={css.content_post} onClick={onClickPost}>
      <div className={css.content_post_inside}>
        <Link href={`/park/contents/${contentData.id}`}>
          <img
            className={css.content_img}
            src={`${process.env.NEXT_PUBLIC_FILESERVER_URL}/video/contents/${contentData.id}/${contentData.id}.webp?${contentData.updated_at}`}
            onError={onErrorImage}
            onClick={e => e.stopPropagation()}
          ></img>
        </Link>
        <div className={css.content_info}>
          <div>
            <div className={css.content_tags_container}>{Tags}</div>
          </div>
          <p className={css.content_title}>{contentData.title}</p>
        </div>
      </div>
    </div>
  )
}

export default ContentPost

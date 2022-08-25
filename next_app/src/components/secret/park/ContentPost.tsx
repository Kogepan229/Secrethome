import css from './ContentPost.module.scss';
import Link from 'next/link'
import SLink from "components/secret/SLink"
import { useRef } from 'react';
import { Tag } from 'util/secret/park/tags';
import SimpleButton from 'components/SimpleButton';

type Props = {
  id: string;
  title: string;
  tags: Tag[];
  updated_at: string;
};

const ContentPost = (props: Props) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const onErrorImage = () => {
    if (imgRef.current) {
      imgRef.current.src = `${process.env.NEXT_PUBLIC_URL}/imageSample.png`
    }
  }

  const Tags = props.tags.map(value => {
    return (
    <Link href={`/secret/park/tag/${value.id}`} key={value.id}>
      <SimpleButton className={css.content_tag}>{value.name}</SimpleButton>
    </Link>
    )
  })

  return (
    <div className={css.content_post}>
      <Link href={`/secret/park/contents/${props.id}`}>
        <div className={css.content_post_inside}>
          <img className={css.content_img} ref={imgRef} src={`${process.env.NEXT_PUBLIC_FILESERVER_URL}/contents/${props.id}/${props.id}.webp?${props.updated_at}`} onError={onErrorImage}></img>
          <div className={css.content_info}>
            <div>
              <div className={css.content_tags_container}>
                {Tags}
              </div>
            </div>
            <p className={css.content_title}>{props.title}</p>
          </div>
        </div>
      </Link>

    </div>
  );
};

export default ContentPost;

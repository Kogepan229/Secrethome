import { useState } from "react"
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from 'util/sql';
import { Tag } from "util/secret/park/tags"
import TagModal from "components/secret/park/TagModal"

type Props = {
  tags: Tag[]
}

const TestModal = (props: Props) => {
  const [isOpenedModal, setIsOpenedModal] = useState(true)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [excludeTagIDList, setExcludeTagIDList] = useState<string[]>([])

  const selectTagCallback = (tag: Tag) => {
    //console.log(tag)
    setSelectedTags([...selectedTags, tag])
    setExcludeTagIDList([...excludeTagIDList, tag.id])
  }

  const Modal = () => {
    //console.log(props.tags)
    if (isOpenedModal) {
      return <TagModal isShow={isOpenedModal} closeCallback={() => setIsOpenedModal(false)} selectTagCallback={selectTagCallback} tagList={props.tags} excludeTagIDList={excludeTagIDList}/>
    } else {
      return <button onClick={() => setIsOpenedModal(true)}>Open Modal</button>
    }
  }
  return (
    <Modal/>
  )
}

export default TestModal

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")
  let result = await DB.query<Tag[]>(`select id, priority, name from park_tags`);
  //console.log(result)
  if (result.length == 0) {
    return { props: {tags: []} };
  } else {
    return {
      props: {tags: JSON.parse(JSON.stringify(result))}
      //props: { id: context.query.content_id, title: result[0].title, description: result[0].description },
    };
  }
};
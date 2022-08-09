import SecretParkLayout from 'components/layout/secretParkLayout';
import ContentPost from 'components/secret/park/ContentPost';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from "util/sql"

import css from "styles/pages/secret/park/contents/contents.module.scss"
import Link from 'next/link';
import { getContentTags, Tag } from 'util/secret/park/tags';
import Header from 'components/secret/park/Header';
import SideBar from 'components/secret/park/SideBar';

type Props = {
  page_num: number;
  contents: {id: string, title: string, description: string, tags: Tag[], updated_at: string}[];
  tags: {tag: Tag, count: number}[]

}

const Contents: NextPage<Props> = (props) => {
  const contents = props.contents.map(content => {
    return (<ContentPost id={content.id} title={content.title} tags={content.tags} updated_at={content.updated_at} key={content.id}></ContentPost>)
  })

  return (
    <SecretParkLayout>
      <div className={css.body_container}>
        <Header/>
        <div className={css.container}>
          <SideBar tags={props.tags}/>
          <div className={css.contents_main}>
            {contents}
          </div>
        </div>
      </div>
    </SecretParkLayout>
  )
}

export default Contents

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let props: Props = {page_num: 0, contents: [], tags: []};
  props.page_num = context.query.page ? Number(context.query.page) : 0;

  //let result = await DB.query<any[]>(`select count(*) from park_contents`);
  //console.log("num", result[0]['count(*)'])

  let result2 = await DB.query<any[]>(`select id, title, description, updated_at from park_contents limit ${props.page_num * 20}, 20`);
  const data = JSON.parse(JSON.stringify(result2));
  //console.log(data)
  for (let i=0;i<data.length;i++) {
    let tags = await getContentTags(data[i].id)
    props.contents[i] = {id: data[i].id, title: data[i].title, description: data[i].description, tags: tags, updated_at: data[i].updated_at}
  }

  let resultTag1 = await DB.query<Tag[]>(`select id, name from park_tags`);
  const dataTag = JSON.parse(JSON.stringify(resultTag1)) as Tag[];
  if (resultTag1.length > 0) {
    let tags = await Promise.all(dataTag.map(async value => {
      let resultTag2 = await DB.query<any[]>(`select count(*) from park_tags_of_contents where tag_id='${value.id}'`);
      return {tag: value, count: resultTag2[0]['count(*)']}
    }))
    tags.sort((a: {tag: Tag, count: number}, b: {tag: Tag, count: number}) => {
      return b.count - a.count
    })
    props.tags = tags;
  }

  return {
    props: props,
  };
};
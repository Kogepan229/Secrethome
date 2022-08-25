import SecretParkLayout from 'components/layout/SecretHomeLayout';
import ContentPost from 'components/secret/park/ContentPost';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from "util/sql"

import css from "styles/pages/secret/park/contents/contents.module.scss"
import Link from 'next/link';
import { getContentTags, getSidebarTags, SidebarTags, Tag } from 'util/secret/park/tags';

type Props = {
  page_num: number;
  contents: {id: string, title: string, description: string, tags: Tag[], updated_at: string}[];
  sidebar_tags: SidebarTags

}

const Contents: NextPage<Props> = (props) => {
  const contents = props.contents.map(content => {
    return (<ContentPost id={content.id} title={content.title} tags={content.tags} updated_at={content.updated_at} key={content.id}></ContentPost>)
  })

  return (
    <SecretParkLayout sidebar_tags={props.sidebar_tags}>
      <div className={css.contents_main}>
        {contents}
      </div>
    </SecretParkLayout>
  )
}

export default Contents

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let props: Props = {page_num: 0, contents: [], sidebar_tags: []};
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

  props.sidebar_tags = await getSidebarTags()

  return {
    props: props,
  };
};
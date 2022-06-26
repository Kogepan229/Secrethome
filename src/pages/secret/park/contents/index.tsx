import SecretParkLayout from 'components/layout/secretParkLayout';
import ContentPost from 'components/secret/park/ContentPost';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from "util/sql"

import css from "styles/pages/secret/park/contents/contents.module.scss"
import Link from 'next/link';

type Props = {
  page_num: number,
  contents: {id: string, title: string, description: string, updated_at: string}[],
}

const Contents: NextPage<Props> = (props) => {
  const contents = props.contents.map(content => {
    return (<ContentPost id={content.id} title={content.title} key={content.id} updated_at={content.updated_at}></ContentPost>)
  })

  return (
    <SecretParkLayout>
      <div className={css.container}>
        <Link href="/secret/park/admin/add_content"><button>追加</button></Link>
        <div className={css.contents_main}>
          {contents}
        </div>
      </div>
    </SecretParkLayout>
  )
}

export default Contents

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  let props: Props = {page_num: 0, contents: []};
  props.page_num = context.query.page ? Number(context.query.page) : 0;

  let result = await DB.query<any[]>(`select count(*) from park_contents`);
  //console.log("num", result[0]['count(*)'])

  let result2 = await DB.query<any[]>(`select id, title, description, updated_at from park_contents limit ${props.page_num * 20}, 20`);
  const data = JSON.parse(JSON.stringify(result2));
  //console.log(data)
  for (let i=0;i<data.length;i++) {
    props.contents[i] = {id: data[i].id, title: data[i].title, description: data[i].description, updated_at: data[i].updated_at}
  }
  //console.log(props)

  return {
    props: props,
  };
};
import SecretParkLayout from 'components/layout/secretParkLayout';
import ContentPost from 'components/secret/park/ContentPost';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from "util/sql"

import css from "styles/pages/secret/park/contents/contents.module.scss"
import Link from 'next/link';

type Props = {
  page_num: number,
  contents: {id: string, title: string, description: string}[],
}

const Contents: NextPage<Props> = (props) => {
  const contents = props.contents.map(content => {
    return (<ContentPost id={content.id} title={content.title} key={content.id}></ContentPost>)
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
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")
  let props: Props = {page_num: 0, contents: []};
  props.page_num = context.query.page ? Number(context.query.page) : 0;
  //props.contents = [];
  let result = await DB.query<any[]>(`select count(*) from park_contents`);
  // console.log(pageNum)
  //console.log("num", result[0]['count(*)'])

  let result2 = await DB.query<any[]>(`select id, title, description from park_contents limit ${props.page_num * 20}, 20`);
  //console.log(result2)
  for (let i=0;i<result2.length;i++) {
    props.contents[i] = {id: result2[i].id, title: result2[i].title, description: result2[i].description}
  }
  //console.log(props)

  return {
    props: props,
  };
};
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { DB } from 'util/sql';
import SecretParkLayout from 'components/layout/SecretHomeLayout';
import css from "styles/pages/secret/park/contents/content.module.scss"
import { useEffect } from 'react';

import VideoPlayer from 'components/VideoPlayer/VideoPlayer';
import Link from 'next/link';
import { getContentTags, SidebarTags, Tag } from 'util/secret/park/tags';
import { getSidebarTags, } from 'util/secret/park/tags';

type Props = {
  id?: string;
  title?: string;
  description?: string;
  tags: Tag[];
  sidebar_tags: SidebarTags;
}

const Content: NextPage<Props> = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    //router.push("/secret/park/contents/")
    console.log(props.tags)
  }, [])

  if (props.id == undefined) {
    return <p>No content</p>;
  }

  return (
    <SecretParkLayout sidebar_tags={props.sidebar_tags}>
      <div className={css.content_container}>
        <div className={css.video_container}>
          <VideoPlayer src={process.env.NEXT_PUBLIC_FILESERVER_URL + "/contents/" +  props.id + "/" + props.id + ".m3u8"}/>
        </div>
        <p className={css.title}>{props.title}</p>
        <p className={css.description}>{props.description}</p>
        <Link href={`/secret/park/admin/update_content/${props.id}`}>更新</Link>
      </div>
    </SecretParkLayout>
  );
  //return <p>Post: {content_id}</p>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  let props: Props = {tags: [], sidebar_tags: []}

  //console.log(context.query.content_id)
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")
  let result = await DB.query<any[]>(`select title, description from park_contents where id='${context.query.content_id}'`);
  if (result.length > 0) {
    props.id = context.query.content_id as string
    props.title = result[0].title
    props.description = result[0].description
    props.tags = await getContentTags(context.query.content_id as string)
    props.sidebar_tags = await getSidebarTags()
  }
  return {props: props}
};

export default Content;

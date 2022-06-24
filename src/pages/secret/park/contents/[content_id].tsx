import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DB } from 'util/sql';
import SecretParkLayout from 'components/layout/secretParkLayout';
import css from "styles/pages/secret/park/contents/content.module.scss"
import { useEffect } from 'react';

//const HLSVideo = dynamic(() => import("components/secret/park/HLSPlayer"), {ssr: false})
import HLSVideo from 'components/secret/park/HLSPlayer';
import Link from 'next/link';

const Content: NextPage = (props: any) => {
  const router = useRouter();

  useEffect(() => {
    //router.push("/secret/park/contents/")
  }, [])

  if (props.title == undefined) {
    return <p>No content</p>;
  }

  return (
    <SecretParkLayout>
      <div className={css.container_wrapper}>
        <div className={css.container}>
          <div className={css.video_container}>
            <HLSVideo src={process.env.NEXT_PUBLIC_FILESERVER_URL + "/contents/" +  props.id + "/" + props.id + ".m3u8"}/>
          </div>
          <p className={css.title}>{props.title}</p>
          <p className={css.description}>{props.description}</p>
          <Link href={`/secret/park/admin/update_content/${props.id}`}>更新</Link>
        </div>
      </div>
    </SecretParkLayout>
  );
  //return <p>Post: {content_id}</p>;
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  console.log(context.query.content_id)
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")
  let result = await DB.query<any[]>(`select title, description from park_contents where id='${context.query.content_id}'`);
  if (result.length == 0) {
    return { props: {} };
  } else {
    return {
      props: { id: context.query.content_id, title: result[0].title, description: result[0].description },
    };
  }
};

export default Content;

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { NextPage } from 'next';
import { DB } from 'util/sql';
import SecretParkLayout from 'components/layout/secretPageBase';
import { useEffect, useState } from 'react';
import axios from 'axios';
import css from "styles/pages/secret/park/admin/add_content.module.scss"
import css2 from "styles/pages/secret/park/admin/update_content.module.scss"
import Router from 'next/router';
import EditContentForm from 'components/secret/park/EditContentForm';
import { getContentTags, Tag } from 'util/secret/park/tags';
import PopupWindowMessage from 'components/PopupWindowMessage';

type Props = {
  id?: string;
  title?: string;
  description?: string;
  selectedTags: Tag[];
  tags: Tag[];
}

const UpdateContent: NextPage<Props> = (props: Props) => {
  const [isShowPopup, setIsShowPopup] = useState(false)

  if (props.id == undefined) {
    return <p>No content</p>;
  }

  const onClickDelete = () => {
    let result = window.confirm("削除しますか")
    if (result) {
      axios.delete("/api/secret/park/delete_content", {data: {id: props.id}}).then(res => {
        if (res.data.result == "success") {
          setIsShowPopup(true)
        } else {
          console.error("res:", res.data.result)
        }
      })
    }
  }

  return (
    <SecretParkLayout>
      <div>
        <EditContentForm isUpdate={true} id={props.id} title={props.title} description={props.description} tags={props.tags} selectedTags={props.selectedTags}></EditContentForm>
        <button className={css2.delete_button} onClick={onClickDelete}>削除</button>
      </div>
      <PopupWindowMessage isShow={isShowPopup} message="削除しました" buttonText='戻る' buttonCallback={() => Router.push("/secret/park/contents/")}/>
    </SecretParkLayout>
  )
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  let result = await DB.query<any[]>(`select title, description from park_contents where id='${context.query.content_id}'`);
  let resultTag = await DB.query<Tag[]>(`select id, name from park_tags`);
  if (result.length == 0) {
    return { props: {tags: [], selectedTags: []} };
  } else {
    return {
      props: { id: context.query.content_id as (string | undefined), title: result[0].title, description: result[0].description, tags: JSON.parse(JSON.stringify(resultTag)), selectedTags: await getContentTags(context.query.content_id as string)},
    };
  }
};

export default UpdateContent;
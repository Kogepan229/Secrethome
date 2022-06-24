import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { NextPage } from 'next';
import { DB } from 'util/sql';
import SecretParkLayout from 'components/layout/secretParkLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import css from "styles/pages/secret/park/admin/add_content.module.scss"
import css2 from "styles/pages/secret/park/admin/update_content.module.scss"
import Router from 'next/router';
import EditContentForm from 'components/secret/park/EditContentForm';

type Props = {
  id?: string;
  title?: string;
  description?: string;
}

const UpdateContent: NextPage = (props: Props) => {
  if (props.id == undefined) {
    return <p>No content</p>;
  }

  const onClickDelete = () => {
    let result = window.confirm("削除しますか")
    if (result) {
      axios.delete("/api/secret/park/delete_content", {data: {id: props.id}}).then(res => {
        if (res.data.result == "success") {
          Router.push("/secret/park/contents/")
        } else {
          console.error("res:", res.data.result)
        }
      })
    }
  }

  return (
    <SecretParkLayout>
      <div>
        <EditContentForm isUpdate={true} id={props.id} title={props.title} description={props.description}></EditContentForm>
        <button className={css2.delete_button} onClick={onClickDelete}>削除</button>
      </div>
    </SecretParkLayout>
  )
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  let result = await DB.query<any[]>(`select title, description from park_contents where id='${context.query.content_id}'`);
  if (result.length == 0) {
    return { props: {} };
  } else {
    return {
      props: { id: context.query.content_id, title: result[0].title, description: result[0].description },
    };
  }
};

export default UpdateContent;
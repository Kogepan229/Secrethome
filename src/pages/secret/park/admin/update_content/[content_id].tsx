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

  const [title, setTitle] = useState(props.title ?? "")
  const [description, setDescription] = useState(props.description ?? "")
  const [movie, setMovie] = useState<File | null>(null)
  const [isEnableSubmit, setIsEnableSubmit] = useState<boolean>(false)

  useEffect(() => {
    if (title != "" && description != "") {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [title, description])

  const handleChangeTitle = (event: any) => {
    setTitle(event.target.value)
  }

  const handleChangeDescription = (event: any) => {
    setDescription(event.target.value)
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setMovie(event.target.files[0])
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const file = new FormData();
    file.append("id", props.id ?? "")
    file.append("title", title)
    file.append("description", description)
    if (movie) {
      file.append("movie", movie)
    }
    //console.log(movie)
    axios.post("/api/secret/park/update_content", file, {headers: {'content-type': 'multipart/form-data',}, onUploadProgress}).then(res => {
      Router.push("/secret/park/contents/" + props.id)
    }).catch(err => [
      console.log("err", err)
    ])
  }

  const onUploadProgress = (progressEvent: any) => {
    console.log(progressEvent)
  }

  const onClickDelete = () => {
    let result = window.confirm("削除しますか")
    if (result) {
      axios.delete("/api/secret/park/delete_content", {data: {id: props.id}}).then(res => {
        Router.push("/secret/park/contents/")
      })
    }
    console.log(result)
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

export default UpdateContent;
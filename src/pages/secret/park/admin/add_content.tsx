import SecretParkLayout from "components/layout/secretParkLayout";
import EditContentForm from "components/secret/park/EditContentForm";
import { NextPage } from "next";
import css from "styles/pages/secret/park/admin/add_content.module.scss"

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from 'util/sql';
import { Tag } from "util/secret/park/tags"
import TagModal from "components/secret/park/TagModal"

type Props = {
  tags: Tag[]
}

const AddContent: NextPage<Props> = (props: Props) => {
  return (
    <SecretParkLayout>
      <div>
        <EditContentForm tags={props.tags}></EditContentForm>
      </div>
    </SecretParkLayout>
  )
}

export default AddContent

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")
  let result = await DB.query<Tag[]>(`select id, name from park_tags`);
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
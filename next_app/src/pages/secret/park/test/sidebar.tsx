import { useState } from "react"
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DB } from 'util/sql';
import Sidebar from "components/secret/park/SideBar"
import { Tag } from "util/secret/park/tags";


const TestPopup = (props: any) => {
  return (
    <>
      <Sidebar tags={props.tags}/>
    </>
  )
}

export default TestPopup


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  //console.log(context.query.content_id)
  //await DB.query("insert into park_contents values ('test1', 'titile dayo', 'description dayo', '2022-11-1 11:11:11', '2022-11-3 13:13:13')")

  let resultTag1 = await DB.query<Tag[]>(`select id, name from park_tags`);
  const dataTag = JSON.parse(JSON.stringify(resultTag1)) as Tag[];
  if (resultTag1.length == 0) {
    return { props: {tags: []} };
  } else {
    let tags = await Promise.all(dataTag.map(async value => {
      let resultTag2 = await DB.query<any[]>(`select count(*) from park_tags_of_contents where tag_id='${value.id}'`);
      return {tag: value, count: resultTag2[0]['count(*)']}
    }))
    tags.sort((a: {tag: Tag, count: number}, b: {tag: Tag, count: number}) => {
      return b.count - a.count
    })
    return {
      props: { tags: tags }
    };
  }

};
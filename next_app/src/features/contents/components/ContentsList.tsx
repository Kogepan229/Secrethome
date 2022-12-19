import { DB } from "util/sql"
import { SearchParams } from "types/SearchParams"
import { getContentTagsData, getSidebarTagsData, SidebarTagsData, TagData } from 'util/secret/park/tags';
import { CONTENTS_NUM_PER_PAGE } from 'features/contents/const';
import { ContentsData } from "features/contents/types";
import ContentPost from "features/contents/components/ContentPost";

const getContentsData = async (searchParams?: SearchParams) => {
  let contentsData: ContentsData = {pageNum :0, contents: [], sidebarTags: []}

  contentsData.pageNum = Number(searchParams?.page)
  contentsData.pageNum = Number.isNaN(contentsData.pageNum) ? 0: contentsData.pageNum;

  // Get contents data from DB
  let SQLResult = await DB.query<any[]>(`select id, title, description, updated_at from park_contents limit ${contentsData.pageNum * 20}, ${CONTENTS_NUM_PER_PAGE}`);
  const data = JSON.parse(JSON.stringify(SQLResult));
  for (let i=0;i<data.length;i++) {
    let tags = await getContentTagsData(data[i].id)
    contentsData.contents[i] = {id: data[i].id, title: data[i].title, description: data[i].description, tags: tags, updated_at: data[i].updated_at}
  }

  contentsData.sidebarTags = await getSidebarTagsData()

  return contentsData
}

const ContentsList = async ({searchParams}: {searchParams?: SearchParams}) => {
  const contentsData = await getContentsData(searchParams)
  const Contents = contentsData.contents.map(content => {
    return (<ContentPost id={content.id} title={content.title} tags={content.tags} updated_at={content.updated_at} key={content.id}></ContentPost>)
  })
  return <>{Contents}</>
}

export default ContentsList
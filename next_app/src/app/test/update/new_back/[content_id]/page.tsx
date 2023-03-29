import { DB } from 'util/sql'
import EditContentForm from '../../../upload/new_back/Edit'
import { getContentTagsData, TagData } from 'util/secret/park/tags'

import ContentDeleteButton from 'features/admin/components/ContentDeleteButton'

type ContentData = {
  id?: string
  title?: string
  description?: string
  selectedTags: TagData[]
  tags: TagData[]
}

const getContentData = async (contentID: any): Promise<ContentData> => {
  let result = await DB.query<any[]>(`select title, description from park_contents where id='${contentID}'`)
  let resultTag = await DB.query<TagData[]>(`select id, name from park_tags`)
  if (result.length == 0) {
    return { tags: [], selectedTags: [] }
  } else {
    return {
      id: contentID as string | undefined,
      title: result[0].title,
      description: result[0].description,
      tags: JSON.parse(JSON.stringify(resultTag)),
      selectedTags: await getContentTagsData(contentID as string),
    }
  }
}

const UpdateContent = async ({ params }: { params: any }) => {
  const contentData = await getContentData(params.content_id)
  if (contentData.id == undefined) {
    return <p>No content</p>
  }

  return (
    <div>
      <EditContentForm
        isUpdate={true}
        id={contentData.id}
        title={contentData.title}
        description={contentData.description}
        tags={contentData.tags}
        selectedTags={contentData.selectedTags}
      ></EditContentForm>
      <ContentDeleteButton contentID={contentData.id} />
    </div>
  )
}

export default UpdateContent

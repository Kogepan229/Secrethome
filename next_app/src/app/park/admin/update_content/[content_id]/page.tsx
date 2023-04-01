import { DB } from 'util/sql'
import EditContentForm from 'features/admin/components/EditContentForm'
import { getContentTagsData, TagData } from 'util/secret/park/tags'

import ContentDeleteButton from 'features/admin/components/ContentDeleteButton'

type ContentData = {
  id?: string
  title?: string
  description?: string
  updatedAt?: string
  selectedTags: TagData[]
}

const getContentData = async (contentID: any): Promise<ContentData> => {
  let result = await DB.query<any[]>(`select title, description, updated_at from park_contents where id='${contentID}'`)
  if (result.length == 0) {
    return { selectedTags: [] }
  } else {
    return {
      id: contentID as string | undefined,
      title: result[0].title,
      description: result[0].description,
      updatedAt: result[0].updated_at,
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
        updatedAt={contentData.updatedAt}
        selectedTags={contentData.selectedTags}
      ></EditContentForm>
      <ContentDeleteButton contentID={contentData.id} />
    </div>
  )
}

export default UpdateContent

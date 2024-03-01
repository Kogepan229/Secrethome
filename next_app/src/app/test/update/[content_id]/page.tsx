import { getDBConnection } from 'utils/sql'
import { getContentTagsData, TagData } from 'features/tags/tags'

import ContentDeleteButton from 'features/rooms/components/editForm/ContentDeleteButton'
import UpdateContentForm from 'features/room_video/components/admin/UpdateContentForm'

type ContentData = {
  id?: string
  title?: string
  description?: string
  updatedAt?: string
  selectedTags: TagData[]
}

const getContentData = async (contentID: any): Promise<ContentData> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query<any[]>(`select title, description, updated_at from contents where id=?`, [contentID])
  con.end()
  const data = JSON.parse(JSON.stringify(rows)) as any[]
  if (data.length == 0) {
    return { selectedTags: [] }
  } else {
    return {
      id: contentID as string,
      title: data[0].title,
      description: data[0].description,
      updatedAt: data[0].updated_at,
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
      <UpdateContentForm
        id={contentData.id}
        roomId="park"
        title={contentData.title ?? ''}
        description={contentData.description ?? ''}
        updatedAt={contentData.updatedAt ?? ''}
        selectedTagList={contentData.selectedTags ?? []}
      ></UpdateContentForm>
      <ContentDeleteButton roomId="park" contentID={contentData.id} />
    </div>
  )
}

export default UpdateContent

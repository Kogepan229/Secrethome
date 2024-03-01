import { getDBConnection } from 'utils/sql'
import { getContentTagsData, TagData } from 'features/tags/tags'

import UpdateContentForm from 'features/room_video/components/admin/UpdateContentForm'

type ContentData = {
  id?: string
  title?: string
  description?: string
  updatedAt?: string
  selectedTags: TagData[]
}

const getContentData = async (contentID: string): Promise<ContentData> => {
  const con = await getDBConnection()
  const [rows, _] = await con.query<any[]>(`SELECT title, description, updated_at FROM contents WHERE id=?`, [contentID])
  con.end()
  const data = JSON.parse(JSON.stringify(rows))
  if (data.length == 0) {
    return { selectedTags: [] }
  } else {
    return {
      id: contentID,
      title: data[0].title,
      description: data[0].description,
      updatedAt: data[0].updated_at,
      selectedTags: await getContentTagsData(contentID),
    }
  }
}

const UpdateContent = async ({ roomName, roomId, contentId }: { roomName: string; roomId: string; contentId: string }) => {
  const contentData = await getContentData(contentId)
  if (contentData.id == undefined) {
    return <p>No content</p>
  }

  return (
    <div>
      <UpdateContentForm
        id={contentData.id}
        roomName={roomName}
        roomId={roomId}
        title={contentData.title ?? ''}
        description={contentData.description ?? ''}
        updatedAt={contentData.updatedAt ?? ''}
        selectedTagList={contentData.selectedTags ?? []}
      />
    </div>
  )
}

export default UpdateContent

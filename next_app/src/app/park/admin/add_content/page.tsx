import EditContentForm from 'features/admin/components/EditContentForm';
import { DB } from 'util/sql';
import { TagData } from "util/secret/park/tags"

const getTagsData = async (): Promise<TagData[]> => {
  let result = await DB.query<TagData[]>(`select id, name from park_tags`);
  if (result.length == 0) {
    return []
  } else {
    return JSON.parse(JSON.stringify(result))
  }
}

const AddContent = async () => {
  const tagsData = await getTagsData()
  return (
    <div>
      <EditContentForm tags={tagsData}></EditContentForm>
    </div>
  )
}

export default AddContent
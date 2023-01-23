import { SidebarTagsData, TagData } from 'util/secret/park/tags'

export type ContentsData = {
  pageNum: number
  contents: { id: string; title: string; description: string; tags: TagData[]; updated_at: string }[]
  sidebarTags: SidebarTagsData
}

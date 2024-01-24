import { SidebarTagsData, TagData } from 'util/secret/park/tags'

export type ContentData = {
  id: string
  title: string
  description: string
  tags: TagData[]
  updated_at: string
}

export type ContentsPageData = {
  pageNum: number
  contents: ContentData[]
}

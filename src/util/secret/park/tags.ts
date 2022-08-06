import { DB } from "util/sql";

export type Tag = {
  id: string;
  //priority: number;
  name: string;
}

export const getContentTags = async (contentID: string) => {
  let result1 = await DB.query<{tag_id: string, priority: number}[]>(`select tag_id, priority from park_tags_of_contents where content_id='${contentID}'`);


  type ContentTag = Tag & {
    priority: number;
  }
  let _tags: ContentTag[] = []

  for (let value of result1) {
    let result2 = await DB.query<ContentTag[]>(`select id, name from park_tags where id='${value.tag_id}'`);
    _tags.push({id: result2[0].id, name: result2[0].name, priority: value.priority})
  }

  _tags.sort((a: ContentTag, b: ContentTag) => {
    return a.priority - b.priority
  })

  let tags = _tags.map(value => {
    return {id: value.id, name: value.name} as Tag
  })

  //console.log("tags", tags)
  return tags
}
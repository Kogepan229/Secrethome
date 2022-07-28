import { DB } from "util/sql";

export type Tag = {
  id: string;
  priority: number;
  name: string;
}

export const getContentTags = async (contentID: string) => {
  let result1 = await DB.query<string[]>(`select tag_id from park_tags_of_contents where content_id='${contentID}'`);

  let tags: Tag[] = []

  for (let value of result1) {
    let result2 = await DB.query<Tag[]>(`select id, priority, name from park_tags where id='${(value as any).tag_id}'`);
    tags.push({id: result2[0].id, priority: result2[0].priority, name: result2[0].name})
  }

  //console.log("tags", tags)
  return tags
}
import "server-only"
import { ReactNode } from "react";
import _SecretRoomLayout from "./_SecretRoomLayout"
import { getSidebarTagsData } from "util/secret/park/tags";

const SecretRoomLayout = async ({children}: {children: ReactNode}) => {
  const tagsData = await getSidebarTagsData()

  return (
    <_SecretRoomLayout sidebarTags={tagsData}>
      {children}
    </_SecretRoomLayout>
  )
}

export default SecretRoomLayout
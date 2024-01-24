import 'server-only'
import { ReactNode } from 'react'
import _SecretRoomLayout from './_SecretRoomLayout'
import { getSidebarTagsData } from 'features/tags/tags'

const SecretRoomLayout = async ({ roomId, children }: { roomId: string; children: ReactNode }) => {
  const tagsData = await getSidebarTagsData(roomId)

  return (
    <_SecretRoomLayout roomId={roomId} sidebarTags={tagsData}>
      {children}
    </_SecretRoomLayout>
  )
}

export default SecretRoomLayout

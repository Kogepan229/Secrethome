import 'server-only'
import { ReactNode } from 'react'
import _SecretRoomLayout from './_SecretRoomLayout'
import { getSidebarTagsData } from 'features/tags/tags'

const SecretRoomLayout = async ({ roomName, roomId, children }: { roomName: string; roomId: string; children: ReactNode }) => {
  const tagsData = await getSidebarTagsData(roomId)

  return (
    <_SecretRoomLayout roomName={roomName} roomId={roomId} sidebarTags={tagsData}>
      {children}
    </_SecretRoomLayout>
  )
}

export default SecretRoomLayout

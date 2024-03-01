import UploadContentForm from 'features/room_video/components/admin/UploadContentForm'

const UploadPage = async ({ roomName, roomId }: { roomName: string; roomId: string }) => {
  return (
    <div>
      <UploadContentForm roomName={roomName} roomId={roomId} />
    </div>
  )
}

export default UploadPage

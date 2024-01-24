import UploadContentForm from 'features/room_video/components/admin/UploadContentForm'

const UploadPage = async ({ roomId }: { roomId: string }) => {
  return (
    <div>
      <UploadContentForm roomId={roomId} />
    </div>
  )
}

export default UploadPage

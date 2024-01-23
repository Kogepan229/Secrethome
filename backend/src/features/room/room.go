package room

type RoomType string

const (
	Admin   = RoomType("admin")
	Video   = RoomType("video")
	Manga   = RoomType("manga")
	Unknown = RoomType("unknown")
)

func GetRoomType(roomTypeStr string) RoomType {
	switch roomTypeStr {
	case "admin":
		return Admin
	case "video":
		return Video
	case "manga":
		return Manga
	default:
		return Unknown
	}
}

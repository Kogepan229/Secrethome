package contents

import (
	"database/sql"
	"fmt"
	"net/http"
	"secrethome-back/api/contents/video"
	"secrethome-back/features"
	"secrethome-back/features/room"
)

func deleteContent(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	if id == "" {
		features.PrintErr(fmt.Errorf("id is empty"))
		http.Error(w, "id is empty", http.StatusBadRequest)
		return
	}

	var roomTypeStr string
	err := features.DB.QueryRow(`SELECT room_type FROM rooms WHERE id = ANY (SELECT room_id FROM contents WHERE id=?)`, id).Scan(&roomTypeStr)
	if err == sql.ErrNoRows {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	roomType := room.GetRoomType(roomTypeStr)
	switch roomType {
	case room.Video:
		video.DeleteVideo(w, r)
		return
	}
}

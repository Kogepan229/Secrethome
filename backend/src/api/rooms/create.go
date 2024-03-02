package rooms

import (
	"log"
	"net/http"
	"secrethome-back/features"
	"secrethome-back/features/room"
)

func createRoom(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	name := r.FormValue("name")
	key := r.FormValue("key")

	if id == "" || name == "" || key == "" {
		http.Error(w, "id, name or key is empty", http.StatusBadRequest)
		return
	}

	description := r.FormValue("description")

	roomType := room.GetRoomType(r.FormValue("room_type"))
	if roomType == room.Unknown {
		http.Error(w, "Invalid room type.", http.StatusBadRequest)
		return
	}
	if roomType == room.Admin {
		var adminCount int
		err := features.DB.QueryRow(`SELECT COUNT(*) FROM rooms WHERE room_type=?`, string(roomType)).Scan(&adminCount)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if adminCount != 0 {
			http.Error(w, "Admin room is already created.", http.StatusBadRequest)
			return
		}
	}

	var count int
	err := features.DB.QueryRow(`SELECT COUNT(*) FROM rooms WHERE id=?`, id).Scan(&count)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if count != 0 {
		http.Error(w, "This id is already exist.", http.StatusBadRequest)
		return
	}

	createdAt := features.GetCurrentTime()
	_, err = features.DB.Exec(`INSERT INTO rooms VALUES (?, ?, ?, ?, ?, ?)`, id, name, description, string(roomType), key, createdAt)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Created new room. room_type[%s] id[%s]", string(roomType), id)
}

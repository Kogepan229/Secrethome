package rooms

import (
	"encoding/json"
	"net/http"
	"secrethome-back/features"
)

type RoomSelect struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Room_type   string `json:"room_type"`
	Key         string `json:"key"`
	Created_at  string `json:"created_at"`
}

func getRoom(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	var rev_room RoomSelect
	err := features.DB.QueryRow(`SELECT * FROM rooms WHERE id=?`, id).Scan(&rev_room.Id, &rev_room.Name, &rev_room.Description, &rev_room.Room_type, &rev_room.Key, &rev_room.Created_at)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resData, err := json.Marshal(rev_room)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = features.ResponseJson(resData, w)
	if err != nil {
		features.PrintErr(err)
		return
	}
}

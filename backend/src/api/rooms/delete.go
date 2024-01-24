package rooms

import (
	"log"
	"net/http"
	"secrethome-back/features"
)

func deleteRoom(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	_, err := features.DB.Exec(`DELETE FROM rooms WHERE id=?`, id)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Delete room id[%s]", id)
}

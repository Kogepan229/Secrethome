package rooms

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"secrethome-back/features"
)

func RoomTypeFromIdHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		id := r.FormValue("id")

		var roomType string
		err := features.DB.QueryRow(`SELECT room_type FROM rooms WHERE id=?`, id).Scan(&roomType)
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid Id", http.StatusBadRequest)
			return
		}
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resData, err := json.Marshal(map[string]string{"room_type": roomType})
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = features.ResponseJson(resData, w)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

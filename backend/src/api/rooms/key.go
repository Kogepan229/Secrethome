package rooms

import (
	"encoding/json"
	"net/http"
	"secrethome-back/features"
)

func RoomIdFromKeyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		key := r.FormValue("key")

		var id string
		err := features.DB.QueryRow(`SELECT id FROM rooms WHERE key=?`, key).Scan(&id)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resData, err := json.Marshal(map[string]string{"id": id})
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

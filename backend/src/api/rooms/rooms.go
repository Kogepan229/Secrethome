package rooms

import (
	"net/http"
)

func RoomsHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodGet {
		getRoom(w, r)
		return
	}
	if r.Method == http.MethodPost {
		createRoom(w, r)
		return
	}
	if r.Method == http.MethodPut {
		updateRoom(w, r)
		return
	}
	if r.Method == http.MethodDelete {
		deleteRoom(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

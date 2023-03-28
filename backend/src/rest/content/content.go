package content

import (
	"net/http"
)

func ContentHundler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		uploadContent(w, r)
		return
	}
	if r.Method == http.MethodPut {
		updateContent(w, r)
		return
	}
	if r.Method == http.MethodDelete {
		deleteContent(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

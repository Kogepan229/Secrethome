package tags

import (
	"net/http"
)

func TagHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		createTag(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

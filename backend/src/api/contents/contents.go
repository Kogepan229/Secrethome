package contents

import "net/http"

func ContentsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodDelete {
		deleteContent(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

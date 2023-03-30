package secretkey

import (
	"encoding/json"
	"fmt"
	"net/http"
	"secrethome-back/features"
)

func SecretkeyHundler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		key := r.FormValue("key")
		fmt.Println("key: " + key)
		if key == "256489" {
			fmt.Println("key: " + key)
			// create json to write response
			b, err := json.Marshal(map[string]string{"url": "/park/contents/"})
			if err != nil {
				features.PrintErr(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// write response
			_, err = w.Write(b)
			if err != nil {
				features.PrintErr(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

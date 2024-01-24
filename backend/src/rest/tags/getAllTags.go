package tags

import (
	"encoding/json"
	"fmt"
	"net/http"
	"secrethome-back/features"
)

type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Tags struct {
	Tags []Tag `json:"tags"`
}

func GetAllTagsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		roomId := r.FormValue("room_id")
		if roomId == "" {
			features.PrintErr(fmt.Errorf("room_id is empty"))
			http.Error(w, "room_id is empty", http.StatusBadRequest)
			return
		}

		rows, err := features.DB.Query(`SELECT id, name FROM tags WHERE room_id=?`, roomId)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tags := Tags{[]Tag{}}
		for rows.Next() {
			var tag Tag
			err = rows.Scan(&tag.ID, &tag.Name)
			if err != nil {
				features.PrintErr(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			tags.Tags = append(tags.Tags, tag)
		}
		rows.Close()

		b, err := json.Marshal(tags)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// write response
		_, err = features.ResponseJson(b, w)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		return
	}
	http.Error(w, "404 Not Found", http.StatusNotFound)
}

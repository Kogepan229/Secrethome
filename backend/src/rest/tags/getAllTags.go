package tag

import (
	"encoding/json"
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
		rows, err := features.DB.Query(`select id, name from park_tags`)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//tags := map[string]string{}
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
			//tags.tags[tag.id] = tag.name

			//tags[tag.id] = tag.name
		}
		rows.Close()

		b, err := json.Marshal(tags)
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

		return
	}
	http.Error(w, "404 Not Found", http.StatusNotFound)
}

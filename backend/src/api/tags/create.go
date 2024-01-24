package tags

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"secrethome-back/features"

	"github.com/oklog/ulid/v2"
)

func createTag(w http.ResponseWriter, r *http.Request) {
	roomId := r.FormValue("room_id")
	name := r.FormValue("name")
	if roomId == "" || name == "" {
		features.PrintErr(fmt.Errorf("room_id or name is empty"))
		http.Error(w, "room_id or name is empty", http.StatusBadRequest)
		return
	}

	id := ulid.Make().String()

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	row := tx.QueryRow(`SELECT COUNT(*) FROM tags WHERE room_id=? AND name=?`, roomId, name)
	if row.Err() != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var count int
	row.Scan(&count)
	if count != 0 {
		errStr := "requested tag already exists"
		tx.Rollback()
		http.Error(w, errStr, http.StatusBadRequest)
		return
	}

	_, err = tx.Exec(`INSERT INTO tags VALUES (?, ?, ?)`, id, roomId, name)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// create json to write response
	b, err := json.Marshal(map[string]string{"id": id})
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write response
	_, err = features.ResponseJson(b, w)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	tx.Commit()

	log.Printf("Created new tag id[%s]", id)
}

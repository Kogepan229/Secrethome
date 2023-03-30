package tag

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"secrethome-back/features"

	"github.com/oklog/ulid/v2"
)

func addTag(w http.ResponseWriter, r *http.Request) {
	id := ulid.Make().String()
	log.Printf("[%s] Start process to add tag", id)

	name := r.FormValue("name")
	if name == "" {
		features.PrintErr(fmt.Errorf("name is empty"))
		http.Error(w, "name is empty", http.StatusBadRequest)
		return
	}
	log.Printf("[%s] tag name: %s", id, name)

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	row := tx.QueryRow(`select count(*) from park_tags where name=?`, name)
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
		//features.PrintErr(err)
		log.Printf("[%s] %s", id, errStr)
		tx.Rollback()
		http.Error(w, errStr, http.StatusBadRequest)
		return
	}

	_, err = tx.Exec(`insert into  park_tags values (?, ?)`, id, name)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write response
	b, err := json.Marshal(map[string]string{"id": id})
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx.Commit()
	log.Printf("[%s] Finished process to add tag", id)
}

package rooms

import (
	"log"
	"net/http"
	"secrethome-back/features"
)

func updateRoom(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	name := r.FormValue("name")
	description := r.FormValue("description")
	key := r.FormValue("key")

	if name == "" && description == "" && key == "" {
		http.Error(w, "No things to update.", http.StatusBadRequest)
		return
	}

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if name != "" {
		_, err = tx.Exec(`UPDATE rooms SET name=? where id=?`, name, id)
		if err != nil {
			features.PrintErr(err)
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if key != "" {
		_, err = tx.Exec(`UPDATE rooms SET key=? where id=?`, key, id)
		if err != nil {
			features.PrintErr(err)
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	_, err = tx.Exec(`UPDATE rooms SET description=? where id=?`, description, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx.Commit()
	log.Printf("Updated room id[%s]", id)
}

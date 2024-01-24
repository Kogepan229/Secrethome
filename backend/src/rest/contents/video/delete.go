package content

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"secrethome-back/features"
)

func deleteContent(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	if id == "" {
		features.PrintErr(fmt.Errorf("id is empty"))
		http.Error(w, "id is empty", http.StatusBadRequest)
		return
	}

	log.Printf("[%s] Start delete process", id)

	err := backupVideoFile(id)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// content path
	contentDirPath := fmt.Sprintf("data_files/contents/%s", id)

	// remove all files
	err = os.RemoveAll(contentDirPath)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = tx.Exec(`delete from park_contents where id=?`, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec(`delete from park_tags_of_contents where content_id=?`, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx.Commit()
	w.WriteHeader(http.StatusOK)

	log.Printf("[%s] Finished delete process", id)
}

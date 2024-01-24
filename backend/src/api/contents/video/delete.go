package video

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"secrethome-back/features"
)

func DeleteVideo(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	if id == "" {
		features.PrintErr(fmt.Errorf("id is empty"))
		http.Error(w, "id is empty", http.StatusBadRequest)
		return
	}

	log.Printf("Start to delete content. id[%s]", id)

	err := backupVideoFile(id)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// content path
	contentDirPath := fmt.Sprintf("%s/contents/%s", DATA_VIDEO_PATH, id)

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

	_, err = tx.Exec(`DELETE FROM contents WHERE id=?`, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec(`DELETE FROM tags_of_contents where content_id=?`, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx.Commit()
	w.WriteHeader(http.StatusOK)

	log.Printf("Deleted content. id[%s]", id)
}

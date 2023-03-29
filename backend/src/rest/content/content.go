package content

import (
	"fmt"
	"net/http"
	"os"
	"secrethome-back/features"

	"github.com/oklog/ulid/v2"
)

func ContentHundler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		uploadContent(w, r)
		return
	}
	if r.Method == http.MethodPut {
		updateContent(w, r)
		return
	}
	if r.Method == http.MethodDelete {
		deleteContent(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

func backupVideoFile(id string) error {
	oldPath := fmt.Sprintf("data_files/contents/%s/%s.mp4", id, id)

	if !features.ExistsFile(oldPath) {
		err := fmt.Errorf(fmt.Sprintf("Not found %s", oldPath))
		return err
	}

	err := os.MkdirAll(fmt.Sprintf("data_files/deleted/%s", id), os.ModePerm)
	if err != nil {
		return err
	}

	err = os.Rename(oldPath, fmt.Sprintf("data_files/deleted/%s/del_%s.mp4", id, ulid.Make().String()))
	if err != nil {
		return err
	}

	return nil
}

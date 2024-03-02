package video

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"secrethome-back/features"

	"github.com/oklog/ulid/v2"
)

const DATA_VIDEO_PATH = features.DATA_FILES_PATH + "/video"

func VideoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		uploadVideo(w, r)
		return
	}
	if r.Method == http.MethodPut {
		updateVideo(w, r)
		return
	}
	if r.Method == http.MethodDelete {
		DeleteVideo(w, r)
		return
	}

	http.Error(w, "404 Not Found", http.StatusNotFound)
}

func backupVideoFile(id string) error {
	oldPath := fmt.Sprintf("%s/contents/%s/%s.mp4", DATA_VIDEO_PATH, id, id)

	if !features.ExistsFile(oldPath) {
		err := fmt.Errorf(fmt.Sprintf("Not found %s", oldPath))
		return err
	}

	err := os.MkdirAll(fmt.Sprintf("%s/deleted/%s", DATA_VIDEO_PATH, id), os.ModePerm)
	if err != nil {
		return err
	}

	newId := ulid.Make().String()
	err = os.Rename(oldPath, fmt.Sprintf("%s/deleted/%s/del_%s.mp4", DATA_VIDEO_PATH, id, newId))
	if err != nil {
		return err
	}

	log.Printf("Backuped video file. oldid[%s] newid[%s]", id, newId)
	return nil
}

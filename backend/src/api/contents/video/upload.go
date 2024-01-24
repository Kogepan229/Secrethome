package video

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"secrethome-back/convert"
	"secrethome-back/features"

	"github.com/oklog/ulid/v2"
)

func uploadVideo(w http.ResponseWriter, r *http.Request) {
	// Check values
	roomId := r.FormValue("room_id")
	title := r.FormValue("title")
	description := r.FormValue("description")
	if roomId == "" || title == "" || description == "" {
		err := fmt.Errorf("room_id, title or description is empty")
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := ulid.Make().String()
	createdAt := features.GetCurrentTime()

	tagsJson := r.FormValue("tagIDs")
	var tagIDs []string
	err := json.Unmarshal([]byte(tagsJson), &tagIDs)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// video file
	videoFile, _, err := r.FormFile("video")
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer videoFile.Close()

	// image file
	imageFile, _, err := r.FormFile("image")
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer imageFile.Close()

	// content path
	contentPath := fmt.Sprintf("%s/contents/%s", DATA_VIDEO_PATH, id)

	// create content dir
	err = os.MkdirAll(contentPath, os.ModePerm)
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// save video file
	videoName := fmt.Sprintf("%s.mp4", id)
	err = features.SaveFile(videoFile, contentPath, videoName)
	if err != nil {
		features.PrintErr(err)
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// save image file
	imageName := fmt.Sprintf("%s.webp", id)
	err = features.SaveFile(imageFile, contentPath, imageName)
	if err != nil {
		features.PrintErr(err)
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec(`INSERT INTO contents values (?, ?, ?, ?, ?, ?)`, id, roomId, title, description, createdAt, createdAt)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	stmt, err := tx.Prepare(`INSERT INTO tags_of_contents values (?, ?, ?)`)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i := 0; i < len(tagIDs); i++ {
		_, err = stmt.Exec(id, tagIDs[i], i)
		if err != nil {
			features.PrintErr(err)
			tx.Rollback()
			os.RemoveAll(contentPath)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	stmt.Close()

	// create json to write response
	b, err := json.Marshal(map[string]string{"id": id})
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send response
	_, err = features.ResponseJson(b, w)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx.Commit()
	//w.WriteHeader(http.StatusOK)

	// 変換開始
	convert.ConversionQueue.Push(id)

	log.Printf("Uploaded new video content. id[%s]", id)
}

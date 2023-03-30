package content

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

func uploadContent(w http.ResponseWriter, r *http.Request) {
	id := ulid.Make().String()
	createdAt := features.GetCurrentTime()

	log.Printf("[%s] Start content upload process", id)

	// values
	title := r.FormValue("title")
	description := r.FormValue("description")
	if title == "" || description == "" {
		features.PrintErr(fmt.Errorf("[%s] title or description is empty", id))
		http.Error(w, "title or description is empty", http.StatusBadRequest)
		return
	}

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
	contentPath := fmt.Sprintf("data_files/contents/%s", id)

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

	_, err = tx.Exec(`insert into park_contents values (?, ?, ?, ?, ?)`, id, title, description, createdAt, createdAt)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	stmt, err := tx.Prepare(`insert into park_tags_of_contents values (?, ?, ?)`)
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

	// write response
	_, err = w.Write(b)
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

	log.Printf("[%s] Finished content upload process", id)
}

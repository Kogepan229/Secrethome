package content

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"secrethome-back/features"
)

func updateContent(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	title := r.FormValue("title")
	description := r.FormValue("description")

	updatedAt := features.GetCurrentTime()

	if id == "" || title == "" || description == "" {
		features.PrintErr(fmt.Errorf("is, title or description is empty"))
		http.Error(w, "id, title or description is empty", http.StatusBadRequest)
		return
	}

	log.Printf("[%s] start update", id)

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
		if err.Error() != "http: no such file" {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	} else {
		defer videoFile.Close()
	}

	// image file
	imageFile, _, err := r.FormFile("image")
	if err != nil {
		if err.Error() != "http: no such file" {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	} else {
		defer imageFile.Close()
	}

	// content path
	contentDirPath := fmt.Sprintf("data_files/contents/%s", id)

	// save video file
	if videoFile != nil {
		videoName := fmt.Sprintf("%s.mp4", id)

		// backup old video
		err = backupVideoFile(id)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//// remove directory ////
		// backup image to tmp
		if imageFile != nil {
			err = os.Rename(fmt.Sprintf("data_files/contents/%s/%s.webp", id, id), fmt.Sprintf("data_files/tmp/%s.webp", id))
			if err != nil {
				features.PrintErr(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		err = os.RemoveAll(contentDirPath)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		err = os.Mkdir(contentDirPath, os.ModePerm)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if imageFile != nil {
			err = os.Rename(fmt.Sprintf("data_files/tmp/%s.webp", id), fmt.Sprintf("data_files/contents/%s/%s.webp", id, id))
			if err != nil {
				features.PrintErr(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		//// remove directory ////

		err = features.SaveFile(videoFile, contentDirPath, videoName)
		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		log.Printf("[%s] updated video", id)
	}

	// save image file
	if imageFile != nil {
		imageName := fmt.Sprintf("%s.webp", id)

		// remove old image
		err = os.Remove(fmt.Sprintf("%s/%s", contentDirPath, imageName))

		if err == nil {
			// save new image
			err = features.SaveFile(imageFile, contentDirPath, imageName)
		}

		if err != nil {
			features.PrintErr(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		log.Printf("[%s] updated image", id)
	}

	tx, err := features.DB.Begin()
	if err != nil {
		features.PrintErr(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec(`update park_contents set title=?, description=?, updated_at=? where id=?`, title, description, updatedAt, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// delete tags info
	_, err = tx.Exec(`delete from park_tags_of_contents where content_id=?`, id)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//// insert tags info ////
	stmt, err := tx.Prepare(`insert into park_tags_of_contents values (?, ?, ?)`)
	if err != nil {
		features.PrintErr(err)
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i := 0; i < len(tagIDs); i++ {
		_, err = stmt.Exec(id, tagIDs[i], i)
		if err != nil {
			features.PrintErr(err)
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	stmt.Close()
	//// insert tags info ////
	tx.Commit()
	w.WriteHeader(http.StatusOK)

	if videoFile != nil {
		// TODO
		// 変換開始
	}

	log.Printf("[%s] upload proccess done!", id)
}

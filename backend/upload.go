package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"secrethome-back/utils"

	"github.com/oklog/ulid/v2"
)

type TagIDs struct {
	IDs []string
}

func UploadHundler(w http.ResponseWriter, r *http.Request) {
	id := ulid.Make().String()
	createdAt := utils.GetCurrentTime()

	// values
	title := r.FormValue("title")
	description := r.FormValue("description")
	if title == "" || description == "" {
		http.Error(w, "title or description is empty", http.StatusBadRequest)
		return
	}

	tagsJson := r.FormValue("tagIDs")
	var tagIDs TagIDs
	err := json.Unmarshal([]byte(tagsJson), &tagIDs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	// video file
	videoFile, _, err := r.FormFile("video")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer videoFile.Close()

	// image file
	imageFile, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer imageFile.Close()

	// content path
	contentPath := fmt.Sprintf("data_files/contents/%s", id)

	// create content dir
	err = os.MkdirAll(contentPath, os.ModePerm)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// save video file
	videoName := fmt.Sprintf("%s.mp4", id)
	err = SaveFile(videoFile, contentPath, videoName)
	if err != nil {
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// save image file
	imageName := fmt.Sprintf("%s.webp", id)
	err = SaveFile(imageFile, contentPath, imageName)
	if err != nil {
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tx, err := DB.Begin()

	if err != nil {
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec(`insert into park_contents values (?, ?, ?, ?, ?)`, id, title, description, createdAt, createdAt)
	if err != nil {
		tx.Rollback()
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	stmt, err := tx.Prepare(`insert into park_tags_of_contents values (?, ?, ?)`)
	if err != nil {
		tx.Rollback()
		os.RemoveAll(contentPath)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i := 0; i < len(tagIDs.IDs); i++ {
		_, err = stmt.Exec(id, tagIDs.IDs[i], i)
		if err != nil {
			tx.Rollback()
			os.RemoveAll(contentPath)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	stmt.Close()

	tx.Commit()
	w.WriteHeader(http.StatusOK)

	// TODO
	// 変換開始

	return
}

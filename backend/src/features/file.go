package features

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
)

func ExistsFile(name string) bool {
	_, err := os.Stat(name)
	return !os.IsNotExist(err)
}

func SaveFile(file multipart.File, path string, name string) error {
	dst, err := os.Create(fmt.Sprintf("%s/%s", path, name))
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		return err
	}

	return nil
}

package utils

import (
	"time"
)

func GetCurrentTime() string {
	t := time.Now()
	return t.Local().Format("2000-01-01T00:00:00.000Z")
}

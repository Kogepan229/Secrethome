package features

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

func GetCurrentTime() string {
	t := time.Now()

	return t.Local().Format("2006-01-02T15:04:05")
}

func GetExeDirPath() string {
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	return filepath.Dir(exePath)
}

func PrintErr(err error) {
	log.Println(err)
	i := 1
	for {
		pt, file, line, ok := runtime.Caller(i)
		if !ok {
			// 取得できなくなったら終了
			break
		}
		funcName := runtime.FuncForPC(pt).Name()
		fmt.Printf("%s, line=%d, func=%v\n", file, line, funcName)
		i += 1
	}
}

func ResponseJson(res []byte, w http.ResponseWriter) (int, error) {
	w.Header().Set("Content-Type", "application/json")
	return w.Write(res)
}

package features

import (
	"fmt"
	"log"
	"runtime"
	"time"
)

func GetCurrentTime() string {
	t := time.Now()

	return t.Local().Format("2006-01-02T15:04:05")
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

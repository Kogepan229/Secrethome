package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"secrethome-back/features"
	v1 "secrethome-back/gen/secrethome/v1"
	"secrethome-back/gen/secrethome/v1/secrethomev1connect"
	"secrethome-back/rest/content"
	"secrethome-back/rest/tag"
	"sync"
	"time"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/bufbuild/connect-go"
	"github.com/rs/cors"
)

type ConversionQueue struct {
	contentIDs []string
	mu         sync.Mutex
}

type ConversionInfo struct {
	finished bool
	logs     []string
}

type SecrethomeServer struct {
}

var conversionQueue ConversionQueue = ConversionQueue{contentIDs: []string{}}

// key: contentID, value: info
var conversionInfoMap map[string]ConversionInfo = map[string]ConversionInfo{}

func (c *ConversionQueue) Push(
	id string,
) error {
	c.mu.Lock()
	c.contentIDs = append(c.contentIDs, id)
	c.mu.Unlock()
	return nil
}

func (c *ConversionQueue) Pop() string {
	c.mu.Lock()
	if len(c.contentIDs) == 0 {
		return ""
	}
	id := c.contentIDs[0]
	c.contentIDs = c.contentIDs[1:]
	c.mu.Unlock()
	return id
}

func (s *SecrethomeServer) Greet(
	ctx context.Context,
	req *connect.Request[v1.GreetRequest],
) (*connect.Response[v1.GreetResponse], error) {
	log.Println("Request headers: ", req.Header())
	res := connect.NewResponse(&v1.GreetResponse{
		Greeting: fmt.Sprintf("Hello, %s!", req.Msg.Name),
	})
	//res.Header().Set("Greet-Version", "v1")
	return res, nil
}

func (s *SecrethomeServer) GetConvertLogs(
	ctx context.Context,
	req *connect.Request[v1.GetConvertLogsRequest],
	stream *connect.ServerStream[v1.GetConvertLogsResponse],
) error {
	//res := connect.NewResponse(&v1.GetConvertLogsResponse{})

	return nil
}

func ConvertProc() {
	for {
		c := conversionQueue.Pop()
		if c == "" {
			// 5秒間隔でポーリング
			time.Sleep(5 * time.Second)
			continue
		}
	}
}

func changeCurrentDir() {
	// change current directory to executable path
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exeDirPath := filepath.Dir(exePath)
	err = os.Chdir(exeDirPath)
	if err != nil {
		panic(err)
	}
}

func main() {
	log.Println("Start secrethome backend")

	changeCurrentDir()

	if !features.ExistsFile("data_files") {
		log.Fatalln("Not found data_files")
	}

	go ConvertProc()

	err := features.ConnectDB()
	if err != nil {
		panic(err)
	}
	defer features.DB.Close()

	err = features.DB.Ping()
	if err != nil {
		panic(err)
	}
	log.Println("Connected DB")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		Debug:            false,
	})

	shserver := &SecrethomeServer{}
	mux := http.NewServeMux()
	mux.Handle(secrethomev1connect.NewSecretHomeServiceHandler(shserver))
	mux.HandleFunc("/api/content", content.ContentHundler)
	mux.HandleFunc("/api/tag", tag.TagHundler)
	err = http.ListenAndServe(
		":60133",
		c.Handler(h2c.NewHandler(mux, &http2.Server{})),
	)
	if err != nil {
		panic(err)
	}
}

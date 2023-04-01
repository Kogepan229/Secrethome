package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"secrethome-back/convert"
	"secrethome-back/features"
	v1 "secrethome-back/gen/secrethome/v1"
	"secrethome-back/gen/secrethome/v1/secrethomev1connect"
	"secrethome-back/rest/content"
	"secrethome-back/rest/secretkey"
	"secrethome-back/rest/tag"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/bufbuild/connect-go"
	"github.com/rs/cors"
)

type SecrethomeServer struct {
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

func changeCurrentDir() {
	// change current directory to executable path
	exeDirPath := features.GetExeDirPath()
	err := os.Chdir(exeDirPath)
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

	go convert.ConvertProc()

	err := features.ConnectDB()
	if err != nil {
		panic(err)
	}
	defer features.DB.Close()

	err = features.PingRecursive()
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
	mux.HandleFunc("/api/secretkey", secretkey.SecretkeyHandler)
	mux.HandleFunc("/api/content", content.ContentHandler)
	mux.HandleFunc("/api/tag", tag.TagHandler)
	mux.HandleFunc("/api/all_tags", tag.GetAllTagsHandler)
	err = http.ListenAndServe(
		":60133",
		c.Handler(h2c.NewHandler(mux, &http2.Server{})),
	)
	if err != nil {
		panic(err)
	}
}

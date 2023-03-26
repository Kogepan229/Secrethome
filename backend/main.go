package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	v1 "secrethome-back/gen/secrethome/v1"
	"secrethome-back/gen/secrethome/v1/secrethomev1connect"

	"github.com/bufbuild/connect-go"
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
	res.Header().Set("Greet-Version", "v1")
	return res, nil
}

func (s *SecrethomeServer) Test(
	ctx context.Context,
	req *connect.Request[v1.TestRequest],
) (*connect.Response[v1.TestResponse], error) {
	log.Println("Request headers: ", req.Header())
	res := connect.NewResponse(&v1.TestResponse{
		Greeting: fmt.Sprintf("Hello, %s!", req.Msg.Name),
	})
	res.Header().Set("Greet-Version", "v1")
	return res, nil
}

func main() {
	shserver := &SecrethomeServer{}
	mux := http.NewServeMux()
	// path, handler := secrethomev1connect.N
	mux.Handle(secrethomev1connect.NewGreetServiceHandler(shserver))
	mux.Handle(secrethomev1connect.NewTagServiceHandler(shserver))
}

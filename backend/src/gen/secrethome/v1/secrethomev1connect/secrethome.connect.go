// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: secrethome/v1/secrethome.proto

package secrethomev1connect

import (
	context "context"
	errors "errors"
	connect_go "github.com/bufbuild/connect-go"
	http "net/http"
	v1 "secrethome-back/gen/secrethome/v1"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect_go.IsAtLeastVersion0_1_0

const (
	// SecretHomeServiceName is the fully-qualified name of the SecretHomeService service.
	SecretHomeServiceName = "secrethome.v1.SecretHomeService"
)

// SecretHomeServiceClient is a client for the secrethome.v1.SecretHomeService service.
type SecretHomeServiceClient interface {
	Greet(context.Context, *connect_go.Request[v1.GreetRequest]) (*connect_go.Response[v1.GreetResponse], error)
	GetConvertLogs(context.Context, *connect_go.Request[v1.GetConvertLogsRequest]) (*connect_go.ServerStreamForClient[v1.GetConvertLogsResponse], error)
}

// NewSecretHomeServiceClient constructs a client for the secrethome.v1.SecretHomeService service.
// By default, it uses the Connect protocol with the binary Protobuf Codec, asks for gzipped
// responses, and sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the
// connect.WithGRPC() or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewSecretHomeServiceClient(httpClient connect_go.HTTPClient, baseURL string, opts ...connect_go.ClientOption) SecretHomeServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &secretHomeServiceClient{
		greet: connect_go.NewClient[v1.GreetRequest, v1.GreetResponse](
			httpClient,
			baseURL+"/secrethome.v1.SecretHomeService/Greet",
			opts...,
		),
		getConvertLogs: connect_go.NewClient[v1.GetConvertLogsRequest, v1.GetConvertLogsResponse](
			httpClient,
			baseURL+"/secrethome.v1.SecretHomeService/GetConvertLogs",
			opts...,
		),
	}
}

// secretHomeServiceClient implements SecretHomeServiceClient.
type secretHomeServiceClient struct {
	greet          *connect_go.Client[v1.GreetRequest, v1.GreetResponse]
	getConvertLogs *connect_go.Client[v1.GetConvertLogsRequest, v1.GetConvertLogsResponse]
}

// Greet calls secrethome.v1.SecretHomeService.Greet.
func (c *secretHomeServiceClient) Greet(ctx context.Context, req *connect_go.Request[v1.GreetRequest]) (*connect_go.Response[v1.GreetResponse], error) {
	return c.greet.CallUnary(ctx, req)
}

// GetConvertLogs calls secrethome.v1.SecretHomeService.GetConvertLogs.
func (c *secretHomeServiceClient) GetConvertLogs(ctx context.Context, req *connect_go.Request[v1.GetConvertLogsRequest]) (*connect_go.ServerStreamForClient[v1.GetConvertLogsResponse], error) {
	return c.getConvertLogs.CallServerStream(ctx, req)
}

// SecretHomeServiceHandler is an implementation of the secrethome.v1.SecretHomeService service.
type SecretHomeServiceHandler interface {
	Greet(context.Context, *connect_go.Request[v1.GreetRequest]) (*connect_go.Response[v1.GreetResponse], error)
	GetConvertLogs(context.Context, *connect_go.Request[v1.GetConvertLogsRequest], *connect_go.ServerStream[v1.GetConvertLogsResponse]) error
}

// NewSecretHomeServiceHandler builds an HTTP handler from the service implementation. It returns
// the path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewSecretHomeServiceHandler(svc SecretHomeServiceHandler, opts ...connect_go.HandlerOption) (string, http.Handler) {
	mux := http.NewServeMux()
	mux.Handle("/secrethome.v1.SecretHomeService/Greet", connect_go.NewUnaryHandler(
		"/secrethome.v1.SecretHomeService/Greet",
		svc.Greet,
		opts...,
	))
	mux.Handle("/secrethome.v1.SecretHomeService/GetConvertLogs", connect_go.NewServerStreamHandler(
		"/secrethome.v1.SecretHomeService/GetConvertLogs",
		svc.GetConvertLogs,
		opts...,
	))
	return "/secrethome.v1.SecretHomeService/", mux
}

// UnimplementedSecretHomeServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedSecretHomeServiceHandler struct{}

func (UnimplementedSecretHomeServiceHandler) Greet(context.Context, *connect_go.Request[v1.GreetRequest]) (*connect_go.Response[v1.GreetResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("secrethome.v1.SecretHomeService.Greet is not implemented"))
}

func (UnimplementedSecretHomeServiceHandler) GetConvertLogs(context.Context, *connect_go.Request[v1.GetConvertLogsRequest], *connect_go.ServerStream[v1.GetConvertLogsResponse]) error {
	return connect_go.NewError(connect_go.CodeUnimplemented, errors.New("secrethome.v1.SecretHomeService.GetConvertLogs is not implemented"))
}

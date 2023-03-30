FROM golang:1.20

RUN apt-get -y update && apt-get -y install ffmpeg

ENV GOPATH /go

RUN go install github.com/uudashr/gopkgs/v2/cmd/gopkgs@latest
RUN go install github.com/ramya-rao-a/go-outline@latest
RUN go install github.com/nsf/gocode@latest
RUN go install github.com/acroca/go-symbols@latest
RUN go install github.com/fatih/gomodifytags@latest
RUN go install github.com/josharian/impl@latest
RUN go install github.com/haya14busa/goplay/cmd/goplay@latest
RUN go install github.com/go-delve/delve/cmd/dlv@latest
RUN go install golang.org/x/lint/golint@latest
RUN go install golang.org/x/tools/gopls@latest
RUN go install github.com/cweill/gotests/gotests@latest
RUN go install honnef.co/go/tools/cmd/staticcheck@latest
RUN go install github.com/stamblerre/gocode@latest
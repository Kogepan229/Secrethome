FROM golang:1.21 AS build

WORKDIR /backend

COPY ./backend/src/ /backend/src/

WORKDIR /backend/src

RUN go mod download

RUN CGO_ENABLED=0 go build -o ../


FROM debian:12

COPY --from=build /backend/secrethome-back /backend/

RUN apt-get -y update && apt-get -y install ffmpeg

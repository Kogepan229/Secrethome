#!/bin/sh
ffmpeg -i $1.mp4 -c:v copy -c:a copy -f segment -segment_format mpegts -hls_time 10 -segment_list $1.m3u8 $1_%03d.ts
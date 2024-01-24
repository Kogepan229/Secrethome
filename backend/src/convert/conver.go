package convert

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
	"secrethome-back/features"
	"sync"
	"time"
)

type ConversionQueueS struct {
	contentIDs []string
	mu         sync.Mutex
}

type ConversionInfoS struct {
	finished bool
	logs     []string
}

var ConversionQueue ConversionQueueS = ConversionQueueS{contentIDs: []string{}}

// key: contentID, value: info
var conversionInfoMap map[string]ConversionInfoS = map[string]ConversionInfoS{}

func (c *ConversionQueueS) Push(
	id string,
) error {
	c.mu.Lock()
	c.contentIDs = append(c.contentIDs, id)
	c.mu.Unlock()
	return nil
}

func (c *ConversionQueueS) Pop() string {
	c.mu.Lock()
	defer c.mu.Unlock()
	if len(c.contentIDs) == 0 {
		return ""
	}
	id := c.contentIDs[0]
	c.contentIDs = c.contentIDs[1:]
	return id
}

func convert(id string) {
	log.Printf("[%s] Start conversion", id)

	cmd := exec.Command("/bin/sh", fmt.Sprintf("%s/video/contents/convert.sh", features.DATA_FILES_PATH), fmt.Sprintf("%s/video/contents/%s/%s", features.DATA_FILES_PATH, id, id))

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		panic(err)
	}

	err = cmd.Start()
	if err != nil {
		panic(err)
	}

	streamReader := func(scanner *bufio.Scanner, outputChan chan string, doneChan chan bool) {
		defer close(outputChan)
		defer close(doneChan)
		for scanner.Scan() {
			outputChan <- scanner.Text()
		}
		doneChan <- true
	}

	stdoutScanner := bufio.NewScanner(stdout)
	if stdoutScanner.Err() != nil {
		panic(err)
	}
	stderrScanner := bufio.NewScanner(stderr)
	if stderrScanner.Err() != nil {
		panic(err)
	}
	stdoutOutputChan := make(chan string)
	stdoutDoneChan := make(chan bool)
	stderrOutputChan := make(chan string)
	stderrDoneChan := make(chan bool)
	go streamReader(stdoutScanner, stdoutOutputChan, stdoutDoneChan)
	go streamReader(stderrScanner, stderrOutputChan, stderrDoneChan)

	// convert.shの標準出力を処理
	stillGoing := true
	for stillGoing {
		select {
		case <-stdoutDoneChan:
			stillGoing = false
		case line := <-stdoutOutputChan:
			log.Println(line)
		case line := <-stderrOutputChan:
			log.Println(line)
		}
	}

	cmd.Wait()

	exitCode := cmd.ProcessState.ExitCode()
	if exitCode != 0 {
		log.Printf("[%s] Failed convert (exit: %d)", id, exitCode)
	} else {
		log.Printf("[%s] Finished conversion", id)
	}

}

func ConvertProc() {
	for {
		id := ConversionQueue.Pop()
		if id == "" {
			// 5秒間隔でポーリング
			time.Sleep(5 * time.Second)
			continue
		}
		convert(id)
	}
}

package features

import (
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() error {
	c := mysql.Config{
		Addr:                 "mysql",
		User:                 "root",
		Passwd:               "root",
		DBName:               "secrethome",
		Net:                  "tcp",
		AllowNativePasswords: true,
	}

	var err error
	DB, err = sql.Open("mysql", c.FormatDSN())
	return err
}

func PingRecursive() error {
	var err error
	for i := 0; i < 10; i++ {
		err = DB.Ping()
		if err == nil {
			return nil
		}
		time.Sleep(5 * time.Second)
	}
	return err
}

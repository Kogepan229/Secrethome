package main

import (
	"database/sql"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() error {
	c := mysql.Config{
		Addr:   "mysql",
		User:   "root",
		Passwd: "root",
		DBName: "secrethome",
		Net:    "tcp",
	}

	var err error
	DB, err = sql.Open("mysql", c.FormatDSN())
	return err
}

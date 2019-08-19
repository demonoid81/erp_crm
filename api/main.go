package main

import (
	"erp_crm/api/server"
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	server.Exec()
}

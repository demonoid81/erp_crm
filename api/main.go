package main

import (
	"github.com/demonoid81/erp_crm/api/server"
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	server.Exec()
}

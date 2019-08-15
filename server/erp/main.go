package main

import (
	"erp_crm/server/erp/cmd"
)

func main() {
	// rand.Seed(time.now().UnixNano())
	// runtime.GOMAXPROC(128)
	cmd.execute()
}
cd
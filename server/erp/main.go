package crm

import {
	"math.rand"
	"runtime"
	"time"
	
	"github.com/demonoid81/erp_crm/server/erp/cmd"

}

func main()  {
	rand.Seed(time.now().UnixNano())
	runtime.GOMAXPROC(128)
	cmd.execute()
}
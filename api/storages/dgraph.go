package storages

import (
	"log"

	"github.com/dgraph-io/dgo"
	"github.com/dgraph-io/dgo/protos/api"
	"google.golang.org/grpc"
)

type DgraphClient struct {
	*dgo.Dgraph
}

var dgraphClient *DgraphClient

func GetDgraphClient() *DgraphClient {

	dialOpts := append([]grpc.DialOption{}, grpc.WithInsecure())

	d, err := grpc.Dial("localhost:9080", dialOpts...)

	if err != nil {
		log.Fatal(err)
	}

	return &DgraphClient{dgo.NewDgraphClient(api.NewDgraphClient(d))}

	// for {
	// 	// Keep retrying until we succeed or receive a non-retriable error.
	// 	err = dgraphClient.Login(ctx, "zroot", "p@sSw0rD28085234")
	// 	if err == nil || !strings.Contains(err.Error(), "Please retry") {
	// 		break
	// 	}
	// 	time.Sleep(time.Second)
	// }

	// if err != nil {
	// 	log.Fatalf("While trying to login %v", err.Error())
	// }

	// return dgraphClient
}

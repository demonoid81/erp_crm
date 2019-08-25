package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"erp_crm/api/generated"
	"erp_crm/api/resolvers"
	"erp_crm/api/storages"

	"github.com/99designs/gqlgen/handler"
	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

type Cache struct {
	client redis.UniversalClient
	ttl    time.Duration
}

const apqPrefix = "apq:"

func NewCache(c *storages.RedisClient, ttl time.Duration) *Cache {
	return &Cache{client: c, ttl: ttl}
}

func (c *Cache) Add(ctx context.Context, hash string, query string) {
	c.client.Set(apqPrefix+hash, query, c.ttl)
}

func (c *Cache) Get(ctx context.Context, hash string) (string, bool) {
	s, err := c.client.Get(apqPrefix + hash).Result()
	if err != nil {
		return "", false
	}
	return s, true
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		header := request.Header.Get("Authorization")
		if header == "" {
			next.ServeHTTP(response, request)
		}
	})
}

func Exec() {
	rClient := storages.GetRedisClient()
	dClient := storages.GetDgraphClient()

	cache := NewCache(rClient, 24*time.Hour)

	router := mux.NewRouter()
	router.HandleFunc("/", handler.Playground("erp_crm", "/api"))
	router.HandleFunc("/api", handler.GraphQL(
		generated.NewExecutableSchema(resolvers.RootResolvers(rClient, dClient)),
		handler.EnablePersistedQueryCache(cache)),
	)

	router.HandleFunc("/ws", handler.GraphQL(
		generated.NewExecutableSchema(resolvers.RootResolvers(rClient, dClient)),
		handler.WebsocketUpgrader(websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			HandshakeTimeout: 5 * time.Second,
		})),
	)

	handler := cors.AllowAll().Handler(router)

	srv := &http.Server{
		Handler:      handler,
		Addr:         ":8001",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}

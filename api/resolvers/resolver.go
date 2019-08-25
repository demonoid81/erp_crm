package resolvers

import (
	"context"
	"erp_crm/api/generated"
	"erp_crm/api/storages"

	"github.com/99designs/gqlgen/graphql"
)

func RootResolvers(redisClient *storages.RedisClient, dgraphClient *storages.DgraphClient) generated.Config {
	c := generated.Config{
		Resolvers: &Resolve{
			redisClient:  redisClient,
			dgraphClient: dgraphClient,
		},
	}
	c.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {

		return nil, nil
	}
	return c

}

type Resolve struct {
	redisClient  *storages.RedisClient
	dgraphClient *storages.DgraphClient
}

func (r *Resolve) Mutation() generated.MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolve) Query() generated.QueryResolver {
	return &queryResolve{r}
}

func (r *Resolve) Subscription() generated.SubscriptionResolver {
	return &subscriptionResolver{r}
}

type queryResolve struct{ *Resolve }

type mutationResolver struct{ *Resolve }

type subscriptionResolver struct{ *Resolve }

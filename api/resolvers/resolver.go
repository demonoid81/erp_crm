package resolvers

import (
	"context"
	"github.com/demonoid81/erp_crm/api/generated"
	"github.com/demonoid81/erp_crm/api/person"
	"github.com/demonoid81/erp_crm/api/storages"

	"github.com/99designs/gqlgen/graphql"
)

func RootResolvers(redisClient *storages.RedisClient, dgraphClient *storages.DgraphClient) generated.Config {
	personResolver := person.New(redisClient, dgraphClient)

	c := generated.Config{
		Resolvers: &Resolver{
			person: personResolver,
		},
	}
	c.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
		return nil, nil
	}
	return c
}

type Resolver struct {
	person		 *person.PersonsResolver
}

func (r *Resolver) Mutation() generated.MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolver) Query() generated.QueryResolver {
	return &queryResolve{r}
}

func (r *Resolver) Subscription() generated.SubscriptionResolver {
	return &subscriptionResolver{r}
}

type queryResolve struct{ *Resolver }

type mutationResolver struct{ *Resolver }

type subscriptionResolver struct{ *Resolver }

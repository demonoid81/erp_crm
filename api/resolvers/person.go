package resolvers

import (
	"context"
	"github.com/demonoid81/erp_crm/api/person"
)

// Queries

func (r *queryResolve) IdentifyPersonByName(ctx context.Context, name string) (*person.IdentifiedPerson, error) {
	return r.person.IdentifyPersonByName(ctx, name)
}

func (r *queryResolve) IdentifyPersonByPhone(ctx context.Context, phone string) (*person.IdentifiedPerson, error) {
	return r.person.IdentifyPersonByPhone(ctx, phone)
}

func (r *queryResolve) AuthPerson(ctx context.Context, params *person.ReqAuthPerson) (*person.Person, error) {
	panic("no")
}

// Mutations

func (r *mutationResolver) UpdatePerson(ctx context.Context, params *person.ReqAuthPerson) (*person.Person, error) {
	panic("no")
}

// Subscriptions

func (r *subscriptionResolver) EventUpdatePerson(ctx context.Context) (<-chan *person.Person, error) {
	panic("no")
}

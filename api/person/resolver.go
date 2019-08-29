package person

import (
	"context"
	"crypto/sha1"
	"fmt"
	"github.com/demonoid81/erp_crm/api/storages"
	"math/rand"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-redis/redis"
	"github.com/vektah/gqlparser/gqlerror"
)

func NewSHA1Hash(n ...int) string {
	noRandomCharacters := 32

	if len(n) > 0 {
		noRandomCharacters = n[0]
	}

	randString := RandomString(noRandomCharacters)

	hash := sha1.New()
	hash.Write([]byte(randString))
	bs := hash.Sum(nil)

	return fmt.Sprintf("%x", bs)
}

var characterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

// RandomString generates a random string of n length
func RandomString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = characterRunes[rand.Intn(len(characterRunes))]
	}
	return string(b)
}

type PersonsResolver struct {
	redisClient  *storages.RedisClient
	dgraphClient *storages.DgraphClient
	Resolver
}

func New(redisClient *storages.RedisClient, dgraphClient *storages.DgraphClient) *PersonsResolver {
	resolver := &PersonsResolver{
		redisClient:  redisClient,
		dgraphClient: dgraphClient,
	}
	return resolver
}

type Resolver interface {
	IdentifyPersonByName(ctx context.Context, name string) (*IdentifiedPerson, error)
	IdentifyPersonByPhone(ctx context.Context, phone string) (*IdentifiedPerson, error)
	AuthPerson(ctx context.Context, params *ReqAuthPerson) (*Person, error)
	UpdatePerson(ctx context.Context, params *ReqAuthPerson) (*Person, error)
	EventUpdatePerson(ctx context.Context) (<-chan *Person, error)
}

type Claims struct {
	Payload     string `json:"payload"`
	Identified   bool   `json:"identified"`
	HasPassword bool   `json:"hasPassword"`
	jwt.StandardClaims
}

var HasPassword = true
var AuthKey = "123456789"

func (r *PersonsResolver) IdentifyPersonByName(ctx context.Context, name string) (*IdentifiedPerson, error) {
	q := `query ident($name: string) {
		ident(func: eq(name, $name)) {
			uid,
			password
		}
	}`
	vars := map[string]string{"$name": name}
	// ! механика
	// * если пользователь найден, то укажем что есть пользователь и скажем клиенту что у него есть пароль или нет
	// * иначе ошибка
	_, err := r.dgraphClient.NewTxn().QueryWithVars(context.Background(), q, vars)
	if err != nil {
		return nil, gqlerror.Errorf("Person not found")
	}

	result := &IdentifiedPerson{
		HasPassword: HasPassword,
		AuthKey:     AuthKey,
	}
	return result, nil
}

func (r *PersonsResolver) IdentifyPersonByPhone(ctx context.Context, phone string) (*IdentifiedPerson, error) {
	q := `query ident($phone: string) {
		ident(func: eq(phone, $phone)) {
			uid,
			password
		}
	}`

	// ! механика
	// * если пользователь найден, то укажем что есть пользователь и скажем клиенту что у него есть пароль или нет
	// * иначе просто отправим токен аутентификации и ждем аутентификации
	resp, _ := r.dgraphClient.NewTxn().QueryWithVars(context.Background(), q, map[string]string{"$phone": phone})

	// * ключ запроса
	key := NewSHA1Hash()
	claims := Claims{
		phone,
		false,
		false,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute).Unix(),
		},
	}
	// * Создаем новый токен
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// * Подписываем токен секретным ключем
	tokenString, _ := token.SignedString([]byte(key))
	_, err := r.redisClient.Pipelined(func(c redis.Pipeliner) error {
		c.Set(tokenString, key, time.Now().Add(time.Minute).Sub(time.Now()))
		return nil
	})

	if err != nil {
		return nil, gqlerror.Errorf("REDIS ERROR")
	}
	fmt.Println(resp) // заглушка
	result := &IdentifiedPerson{
		Identified: false,
		HasPassword: false,
		AuthKey:     tokenString,
	}

	return result, nil
}

func (r *PersonsResolver) AuthPerson(ctx context.Context, params *ReqAuthPerson) (*Person, error) {
	panic('n')
}

func (r *PersonsResolver) UpdatePerson(ctx context.Context, params *ReqAuthPerson) (*Person, error) {
	panic('n')
}

func (r *PersonsResolver) EventUpdatePerson(ctx context.Context) (<-chan *Person, error) {
	panic('n')
}



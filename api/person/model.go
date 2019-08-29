package person

type Person struct {
	UID     string `json:"uid"`
	Name    string `json:"name"`
	Country string `json:"country"`
	Phone   string `json:"phone"`
	Token   string `json:"token"`
}

type IdentifiedPerson struct {
	Identified  bool   `json:"identified"`
	HasPassword bool   `json:"hasPassword"`
	AuthKey     string `json:"authKey"`
}

type ReqAuthPerson struct {
	AuthKey  *string `json:"authKey"`
	Key      *string `json:"key"`
	Password *string `json:"password"`
}

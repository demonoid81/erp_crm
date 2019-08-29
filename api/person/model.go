package person

type Person struct {
	UID     string `json:"uid"`
	Name    string `json:"name"`
	Country string `json:"country"`
	Phone   string `json:"phone"`
	Token   string `json:"token"`
}

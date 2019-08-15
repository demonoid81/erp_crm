package cmd

import (
	"net/http"

	"github.com/gorilla/mux"
)

func execute() {
	router := mux.NewRouter()
	http.Handle("/", router)

	err := http.ListenAndServe(":8080", router)
	if err != nil {
		panic(err)
	}
}

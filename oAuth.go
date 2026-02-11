package main

import (
	"context"
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// service account config
// credit: https://github.com/googleapis/google-api-go-client
var config = &oauth2.Config{
	RedirectURL:  "",
	ClientID:     "",
	ClientSecret: "",
	Endpoint:     google.Endpoint,
	Scopes: []string{"https://www.googleapis.com/auth/cloud-platform",
		"https://www.googleapis.com/auth/drive"},
}

func getClient() *http.Client {
	url := config.AuthCodeURL("state", oauth2.AccessTypeOffline)
	println("Visit the URL for the auth dialog: ", url)
	var code string
	fmt.Scan(&code)
	token, err := config.Exchange(context.TODO(), code)
	if err != nil {
		return nil
	}
	return config.Client(context.Background(), token)
}
func googlelogin(w http.ResponseWriter, r *http.Request) {
	url := config.AuthCodeURL("state", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func handleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.FormValue("code")
	token, err := config.Exchange(context.TODO(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}
	client := config.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com")
	if err != nil {
		http.Error(w, "Failed to get response: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	w.Write([]byte("Authentication successful!"))
}
func main() {
	http.HandleFunc("/login", googlelogin)
	http.HandleFunc("/callback", handleCallback)
	fmt.Println("Server started at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

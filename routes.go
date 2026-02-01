package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type RouteRequest struct {
	Origin      LatLng `json:"origin"`
	Destination LatLng `json:"destination"`
	Mode        string `json:"mode"`
}
type LatLng struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}
type RouteResponse struct {
	Duration string `json:"duration"`
	Distance string `json:"distance"`
	Polyline string `json:"polyline"`
}

func RouteHandler(w http.ResponseWriter, r *http.Request) {
	req := RouteRequest{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)
	if r.Method != "POST" {
		w.WriteHeader(405)
		w.Write([]byte(`{"error": "Invalid send type"}`))
		return
	}
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "Invalid request"}`))
		return
	}
	if req.Mode == "" {
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "You must have a mode of traveling."}`))
		return
	}
	if req.Origin.Lat < -90 || req.Origin.Lat > 90 || req.Origin.Lng < -180 || req.Origin.Lat > 180 {
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "Invalid Coordinates"}`))
		return
	}
	if req.Destination.Lat < -90 || req.Destination.Lat > 90 || req.Destination.Lng < -180 || req.Destination.Lng > 180 {
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "Invalid Coordinates"}`))
		return
	}
	resp := RouteResponse{
		Duration: "12 mins",
		Distance: "0.3 Miles",
		Polyline: "absb1243",
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`{"error": "Failed to encode response"}`))
		return
	}
}
func main() {
	http.HandleFunc("/route", RouteHandler)
	fmt.Println("Server running on http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Server failed", err)
	}

}

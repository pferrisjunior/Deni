package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
)

type RouteRequest struct {
	Origin      LatLng `json:"origin"`
	Destination LatLng `json:"destination"`
	Mode        string `json:"mode"`
}
type LatLng struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
type RouteResponse struct {
	Duration string `json:"duration"`
	Distance string `json:"distance"`
	Polyline string `json:"polyline"`
}
type LatLngWrapper struct {
	LatLng LatLng `json:"latLng"`
}
type Waypoint struct {
	Location LatLngWrapper `json:"location"`
}
type GoogleRouteRequest struct {
	Origin      Waypoint `json:"origin"`
	Destination Waypoint `json:"destination"`
	TravelMode  string   `json:"travelMode"`
}

func routeTranslator(req RouteRequest) (GoogleRouteRequest, error) {
	var travelMode string
	switch req.Mode {
	case "driving":
		travelMode = "DRIVE"
	case "walking":
		travelMode = "WALK"
	default:
		return GoogleRouteRequest{}, fmt.Errorf("unsupported mode: %s", req.Mode)
	}
	googleReq := GoogleRouteRequest{
		Origin: Waypoint{
			Location: LatLngWrapper{
				LatLng: LatLng{
					Latitude:  req.Origin.Latitude,
					Longitude: req.Origin.Longitude,
				},
			},
		},
		Destination: Waypoint{
			Location: LatLngWrapper{
				LatLng: LatLng{
					Latitude:  req.Destination.Latitude,
					Longitude: req.Destination.Longitude,
				},
			},
		},
		TravelMode: travelMode,
	}

	return googleReq, nil
}
func RouteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(405)
		w.Write([]byte(`{"error": "Invalid send type"}`))
		return
	}
	req := RouteRequest{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)
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
	if req.Origin.Latitude < -90 || req.Origin.Latitude > 90 || req.Origin.Longitude < -180 || req.Origin.Longitude > 180 {
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "Invalid Coordinates"}`))
		return
	}
	if req.Destination.Latitude < -90 || req.Destination.Latitude > 90 || req.Destination.Longitude < -180 || req.Destination.Longitude > 180 {
		w.WriteHeader(400)
		w.Write([]byte(`{"error": "Invalid Coordinates"}`))
		return
	}
	googleReq, err := routeTranslator(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Bad request"}`))
		return
	}
	apiKey := os.Getenv("GOOGLE_ROUTES_API_KEY")
	if apiKey == "" {
		log.Println("Could not load api key.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	payload, err := json.Marshal(googleReq)
	if err != nil {
		log.Println("Error marhshaliing google request:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	googleURL := "https://routes.googleapis.com/directions/v2:computeRoutes"
	client := http.DefaultClient
	reqGoogle, _ := http.NewRequest("POST", googleURL, bytes.NewReader(payload))
	reqGoogle.Header.Set("Content-Type", "application/json")
	reqGoogle.Header.Set("X-Goog-Api-Key", apiKey)
	reqGoogle.Header.Set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline")
	resp, err := client.Do(reqGoogle)
	if err != nil {
		log.Println("Error calling google routes: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Println("Google returned non-200:", resp.StatusCode, string(bodyBytes))
		w.WriteHeader(http.StatusBadGateway)
		w.Write([]byte(`{"error": "Failed to fetch route from Google"}`))
		return
	}
	var googleResp struct {
		Routes []struct {
			DurationSeconds int `json:"durationSeconds"`
			DistanceMeters  int `json:"distanceMeters"`
			Polyline        struct {
				EncodedPolyline string `json:"encodedPolyline"`
			} `json:"polyline"`
		} `json:"routes"`
	}
	err = json.NewDecoder(resp.Body).Decode(&googleResp)
	if err != nil {
		log.Println("Error decoding Google response:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(googleResp.Routes) == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error": "No route found"}`))
		return
	}
	route := googleResp.Routes[0]
	minutes := route.DurationSeconds / 60
	routeResp := RouteResponse{
		Duration: fmt.Sprintf("%d mins", minutes),
		Distance: fmt.Sprintf("%d meters", route.DistanceMeters),
		Polyline: route.Polyline.EncodedPolyline,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(routeResp)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file.")
	}
	http.HandleFunc("/route", RouteHandler)
	fmt.Println("Server running on http://localhost:8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Server failed", err)
	}

}

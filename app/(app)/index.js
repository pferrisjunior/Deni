// import tools
import React, { useState, useRef, useEffect } from "react";

// import router hook for screen navigation
import { useRouter } from "expo-router";

import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
} from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

// firebase imports
import { ref, onValue } from "firebase/database";
import { db, auth } from "../../lib/firebase";

// custom hook for getting the user's current location
import useUserLocation from "../../hooks/userLocation";

// safe area tools so the top UI does not go under the iPhone notch/status bar
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Modal, Linking } from "react-native";
import useGeocoding from "../../hooks/useGeocoding";
import useRoute from "../../hooks/useRoute";
import { Platform } from "react-native";

// export for the Home Page
export default function HomePage() {
  // router for navigation between screens
  const router = useRouter();

  // map ref so we can move the camera programmatically
  const currentLocation = useRef(null);

  // safe area insets so top controls stay below notch/status bar
  const insets = useSafeAreaInsets();

  // user search state
  const [search, setSearch] = useState("");
  // for routing
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("driving");
  const [destination, setDestination] = useState(null);
  const {
    route,
    coords,
    getRoute,
    clearRoute,
    distanceText,
    durationText,
    loading
  } = useRoute();
  const { geocode, reverseGeocode } = useGeocoding();
  const handleGetRoute = async () => {
    if (!input.trim() || !selectedLocation) return;

    const geo = await geocode(input);

    if (!geo) {
      alert("Invalid address");
      return;
    }

    const start = {
      latitude: geo.lat,
      longitude: geo.lng,
    };

    const end = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };
    setDestination(end);
    setSelectedLocation(null);
    await getRoute(start, end, mode);
    setRouteModalVisible(false);
  };
  const openInMaps = () => {
    if (!input || !destination) return;

    const origin = encodeURIComponent(input);
    const dest = `${destination.latitude},${destination.longitude}`;

    if (Platform.OS === "ios") {
      // Apple Maps
      const appleUrl = `maps://?saddr=${origin}&daddr=${dest}&dirflg=${mode === "walking" ? "w" : "d"}`;
      const webFallback = `https://maps.apple.com/?saddr=${origin}&daddr=${dest}&dirflg=${mode === "walking" ? "w" : "d"}`;

      Linking.canOpenURL(appleUrl).then((supported) => {
        Linking.openURL(supported ? appleUrl : webFallback);
      });

    } else {
      // Google Maps
      const nativeUrl = `comgooglemaps://?saddr=${origin}&daddr=${dest}&directionsmode=${mode}`;
      const webFallback = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`;

      Linking.canOpenURL(nativeUrl).then((supported) => {
        Linking.openURL(supported ? nativeUrl : webFallback);
      });
    }

  };
  const handleSearchSubmit = () => {
    if (!search.trim()) return;

    const cleanSearch = search.toLowerCase().trim();
    const allData = [...events, ...locations];

    const filtered = allData.filter((item) => {
      const searchableText = `
      ${item?.name || ""}
      ${item?.type || ""}
      ${item?.city || ""}
      ${item?.state || ""}
      ${item?.description || ""}
    `.toLowerCase();

      return searchableText.includes(cleanSearch);
    });

    setFilteredEvents(filtered);

    // move map
    if (filtered.length > 0) {
      const first = filtered[0];

      if (
        typeof first.latitude === "number" &&
        typeof first.longitude === "number"
      ) {
        currentLocation.current?.animateToRegion({
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      }
    }
  };


  const getStatus = (event) => {
    if (event.type === "food_truck") return "active";

    const now = new Date();

    if (!event.startTime || !event.endTime) return "active";
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    if (now > endDate) return "inactive";
    if (now >= startDate) return "active";
    return "future";
  };

  // updated color coding for different marker types
  const getMarkerColor = (event) => {
  if (event.type === "food_truck") return "#F59E0B"; // orange;
  return "green";
};

  const moveToUserLocation = () => {
    if (!latitude || !longitude || !currentLocation.current) return;

    currentLocation.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    });
  };


  // current user location from custom hook
  const { latitude, longitude, errorMessage } = useUserLocation();

  // live data state from Firebase
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locations, setLocations] = useState([]);

  // when user location becomes available, animate map to that region
  useEffect(() => {
    if (latitude && longitude && currentLocation.current) {
      currentLocation.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
    }
  }, [latitude, longitude]);

  // log auth state for debugging
  useEffect(() => {
    console.log("CURRENT USER UID:", auth.currentUser?.uid);
  }, []);

  // live read for events
  useEffect(() => {
    const eventsRef = ref(db, "events");

    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        console.log("EVENT SNAPSHOT EXISTS:", snapshot.exists());

        const data = snapshot.val();
        console.log("RAW EVENT DATA:", data);

        if (!data) {
          console.log("NO EVENTS FOUND");
          setEvents([]);
          setFilteredEvents([]);
          return;
        }

        const loadedEvents = Object.keys(data).map((id) => {
          const item = data[id];

          return {
            id,
            name: item.title || "Untitled Event",
            description: item.description || "",
            latitude: item.location?.lat ?? null,
            longitude: item.location?.lng ?? null,
            city: item.location?.name || "",
            state: "",
            type: "event",
            startTime: item.startTime || null,
            endTime: item.endTime || null,
            createdByUid: item.createdByUid || null,
          };
        });

        console.log("LOADED EVENTS FROM DB:", loadedEvents);
        setEvents(loadedEvents);

      },
      (error) => {
        console.log("EVENT READ ERROR:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("TRUCK EFFECT RAN");

    const trucksRef = ref(db, "trucks");
    console.log("TRUCK REF PATH:", "trucks");

    const unsubscribe = onValue(
      trucksRef,
      (snapshot) => {
        console.log("TRUCK SNAPSHOT EXISTS:", snapshot.exists());

        const data = snapshot.val();
        console.log("RAW TRUCK DATA:", data);

        if (!data) {
          console.log("NO TRUCKS FOUND");
          setLocations([]);
          return;
        }

        const loadedTrucks = Object.keys(data)
          .map((id) => {
            const item = data[id];

            const lat = item.location?.lat ?? item.latitude ?? item.lat;
            const lng = item.location?.lng ?? item.longitude ?? item.lng;

            return {
              id,
              name: item.name || item.title || "Unnamed Truck",
              description: item.description || "",
              latitude: typeof lat === "string" ? Number(lat) : lat,
              longitude: typeof lng === "string" ? Number(lng) : lng,
              type: "food_truck",
              active: item.active ?? true,
            };
          })
          .filter(
            (item) =>
              item.active &&
              typeof item.latitude === "number" &&
              !Number.isNaN(item.latitude) &&
              typeof item.longitude === "number" &&
              !Number.isNaN(item.longitude)
          );

        console.log("LOADED TRUCKS FROM DB:", loadedTrucks);
        setLocations(loadedTrucks);
      },
      (error) => {
        console.log("TRUCK READ ERROR:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // log events for debugging while developing
  useEffect(() => {
    console.log("EVENTS:", events);
  }, [events]);

  // log filtered events for debugging search results
  useEffect(() => {
    console.log("FILTERED EVENTS:", filteredEvents);
  }, [filteredEvents]);
//trying to fix those food truck markers not showing up on the map by combining the events and locations into one array for filtering and display
  useEffect(() => {
  setFilteredEvents([...events, ...locations]);
}, [events, locations]);

  // store what user is typing into the search bar
  const handleSearch = (text) => {
    setSearch(text);
  };

  // combine data fields of events and food trucks before filtering
  const combinedData = [...events, ...locations];



  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={currentLocation}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: latitude || 35.0458,
          longitude: longitude || -85.3094,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        onPress={(e) => {
          // Only clear if tapping the actual map, not a marker
          if (e.nativeEvent.action !== 'marker-press') {
            setSelectedLocation(null);
          }
        }}
      >
        {/* event markers from Firebase event data */}
        {filteredEvents
          .filter(
            (event) =>
              typeof event.latitude === "number" &&
              typeof event.longitude === "number"
          )
          .map((event) => {
            const status = getStatus(event);

            return (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                title={event.name}
                description={event.description}
                pinColor={getMarkerColor(event)}
                onPress={() => setSelectedLocation(event)}
              />
            );
          })}
        {/* marker showing the user's current location */}
        {latitude && longitude && (
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
            title="You are here"
            pinColor="blue"
          />
        )}
        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeWidth={4}
            strokeColor={mode === "walking" ? "green" : "blue"}
          />
        )}
      </MapView>
      {selectedLocation && !route && (
        <View style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          left: 20,
          right: 20,
          backgroundColor: "white",
          padding: 12,
          borderRadius: 12,
        }}>
          <Text style={{ fontWeight: "bold" }}>
            {selectedLocation.name}
          </Text>

          <Pressable onPress={() => setRouteModalVisible(true)}>
            <Text style={{ color: "blue", marginTop: 6 }}>
              Get Route
            </Text>
          </Pressable>

          <Pressable onPress={() => setSelectedLocation(null)}>
            <Text style={{ color: "red", marginTop: 6 }}>
              Close
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.topWrap}></View>
      <Modal visible={routeModalVisible} animationType="slide" transparent>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
          }}
          onPress={() => setRouteModalVisible(false)}
        >
          <Pressable
            onPress={() => { }}
            style={{
              margin: 20,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
            }}
          >

            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Route Options
            </Text>


            <TextInput
              placeholder="Enter starting location"
              value={input}
              onChangeText={setInput}
              style={{
                borderWidth: 1,
                padding: 10,
                marginTop: 15,
                borderRadius: 8,
              }}
            />


            <Pressable
              onPress={async () => {
                if (!latitude || !longitude) return;

                const result = await reverseGeocode(latitude, longitude);

                if (result) {
                  setInput(result.address);
                }
              }}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "blue" }}>
                Use Current Location
              </Text>
            </Pressable>


            <View style={{ flexDirection: "row", gap: 15, marginTop: 20 }}>
              <Pressable onPress={() => setMode("driving")}>
                <Text style={{ color: mode === "driving" ? "blue" : "black" }}>
                  Drive
                </Text>
              </Pressable>

              <Pressable onPress={() => setMode("walking")}>
                <Text style={{ color: mode === "walking" ? "blue" : "black" }}>
                  Walk
                </Text>
              </Pressable>
            </View>


            <Pressable
              onPress={handleGetRoute}
              style={{ marginTop: 30 }}
            >
              <Text style={{ color: "blue", fontSize: 16 }}>
                Start Route
              </Text>
            </Pressable>


            <Pressable
              onPress={() => setRouteModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text>Cancel</Text>
            </Pressable>

          </Pressable>
        </Pressable>
      </Modal>

      <View style={[styles.topWrap, { top: insets.top + 10 }]}>
        <View style={styles.searchRow}>
          <Pressable style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={24} color="#111" />
          </Pressable>

          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#111"
              style={styles.searchIcon}
            />

            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder="Looking for something?"
              placeholderTextColor="#666"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
            />
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/(app)/add-events")}
          >
            <Ionicons name="add" size={26} color="#555" />
          </Pressable>

          <Pressable
            style={styles.locationButton}
            onPress={moveToUserLocation}
          >
            <Ionicons name="locate-outline" size={22} color="#111" />
          </Pressable>
        </View>


      </View>
      {route && (
        <View style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          left: 20,
          right: 20,
          backgroundColor: "white",
          padding: 12,
          borderRadius: 12,
        }}>
          <Text>
            {durationText} • {distanceText}
          </Text>
          <Pressable onPress={openInMaps}>
            <Text style={{ color: "green", marginTop: 6 }}>
              Open in Maps
            </Text>
          </Pressable>

          <Pressable onPress={clearRoute}>
            <Text style={{ color: "blue", marginTop: 6 }}>
              Close Route
            </Text>
          </Pressable>
        </View>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </SafeAreaView>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  errorText: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: "red",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  topWrap: {
    position: "absolute",
    left: 10,
    right: 10,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  locationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    flex: 1,
    height: 46,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    marginRight: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },

  dropdown: {
    marginTop: 8,
    backgroundColor: "rgba(235,235,235,0.98)",
    borderRadius: 16,
    padding: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  categoriesRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 10,
  },

  resultItem: {
    paddingVertical: 6,
  },
});

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

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
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
  const [selected, setSelected] = useState(false);

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
          setFilteredEvents(loadedEvents);
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
              };
            })
            .filter(
              (item) =>
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

  // store what user is typing into the search bar
  const handleSearch = (text) => {
    setSearch(text);
  };

  // combine data fields of events and food trucks before filtering
  const combinedData = [...events, ...locations];


  // filter events whenever search text changes
  useEffect(() => {
    const cleanSearch = search.toLowerCase().trim();

    const allData = [...events, ...locations];

    if (cleanSearch.length === 0) {
      setFilteredEvents(allData);
      return;
    }

    const filtered = allData.filter((item) => {
      const searchableText = `
        ${item.name}
        ${item.type?.replace("_", " ") || ""}
        ${item.city || ""}
        ${item.state || ""}
        ${item.description || ""}
      `.toLowerCase();

      return searchableText.includes(cleanSearch);
    });

    setFilteredEvents(filtered);
  }, [search, events, locations]);

  // move map to a selected event
  const moveToEvent = (event) => {
    if (!event || !currentLocation.current) return;

    console.log("MOVING TO:", event.city, event.state);

    currentLocation.current.animateToRegion({
      latitude: event.latitude,
      longitude: event.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    });
  };

  // move map back to the user's current location
  const moveToUserLocation = () => {
    if (!latitude || !longitude || !currentLocation.current) return;

    console.log("MOVING TO USER LOCATION");

    currentLocation.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    });
  };

  // search submit first tries matching a known truck name or event, then falls back to first matching event
  const handleSearchSubmit = () => {
    if (!search || !currentLocation.current) return;

    const lowerSearch = search.toLowerCase();
    const cleanSearch = lowerSearch.trim();

    let locationMatch = locations.find((loc) => {
      const name = loc.name?.toLowerCase().trim();
      return cleanSearch === name || cleanSearch.includes(name);
    });

    if (locationMatch) {
      console.log("MOVING TO LOCATION:", locationMatch.name);

      currentLocation.current.animateToRegion({
        latitude: locationMatch.latitude,
        longitude: locationMatch.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
      return;
    }

    // if no truck match is found, move to the first matching event
    if (filteredEvents.length > 0) {
      moveToEvent(filteredEvents[0]);
    }
  };

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
      >
        {/* event markers from Firebase event data */}
          {filteredEvents
            .filter(
              (event) =>
                typeof event.latitude === "number" &&
                typeof event.longitude === "number"
            )
            .map((event) => (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                title={event.name}
                description={event.description}
              />
            ))}

        {/* truck markers from Firebase truck data */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={loc.name}
            description={loc.description}
            pinColor="green"
          />
        ))}

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
      </MapView>

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
              onFocus={() => setSelected(true)}
              onBlur={() => setSelected(false)}
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

        {selected && (
          <View style={styles.dropdown}>
            <Text style={styles.sectionTitle}>Categories:</Text>

            <View style={styles.categoriesRow}>
              <Ionicons name="restaurant-outline" size={22} color="#555" />
              <Ionicons name="wine-outline" size={22} color="#555" />
              <Ionicons name="color-palette-outline" size={22} color="#555" />
            </View>

            <Text style={styles.sectionTitle}>Popular Searches</Text>

            <Pressable style={styles.resultItem}>
              <Text>Food trucks near me</Text>
            </Pressable>

            <Pressable style={styles.resultItem}>
              <Text>Live music tonight</Text>
            </Pressable>

            <Pressable style={styles.resultItem}>
              <Text>Community events</Text>
            </Pressable>
          </View>
        )}
      </View>

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

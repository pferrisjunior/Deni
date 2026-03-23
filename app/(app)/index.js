// import tools
//import router
import { useRouter } from "expo-router";
//use state for screen memory
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  Image,
} from "react-native";
//import MapView from "react-native-maps";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import useUserLocation from "../../hooks/userLocation";
import mockEvents from "../../data/mockEvents";
import mockLocations from "../../data/mockLocations";

//safe area tools so the top UI does not go under the iPhone notch/status bar
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// export for the Home Page
export default function HomePage() {
  //router 
  const router = useRouter();
  //map current location memory (ref to control map later)
  const currentLocation = useRef(null);

  //safe area insets (push UI below iPhone notch/status bar)
  const insets = useSafeAreaInsets();

  //user search
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(false);

  const { latitude, longitude, errorMessage } = useUserLocation();

  //using mock data for food trucks/events until backend is up and running
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locations, setLocations] = useState([]);

  //getting the state abbreviations for the mock data
   const getFullStateName = (abbr) => {
    if (!abbr) return "";

    const states = {
      tx: "texas",
      tn: "tennessee",
    };
    return states[abbr.toLowerCase()] || "";
  };

//user location
  useEffect(() => {
    if (latitude && longitude && currentLocation.current) {
      currentLocation.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [latitude, longitude]);

  //use effect to log events
  useEffect(() => {
  console.log("EVENTS:", events);
}, [events]);

//use effect to log filtered events 
 useEffect(() => {
  console.log("FILTERED EVENTS:", filteredEvents);
}, [filteredEvents]);

//user effect to to set mock events on app load
useEffect(() => {
  setEvents(mockEvents);
  setLocations(mockLocations);
}, []);

//store what user is typing
  const handleSearch = (text) => {
    setSearch(text);
};

useEffect(() => {
  if (!search) {
    setFilteredEvents(events);
    return;
  }

  const keywords = search.toLowerCase().split(" ");

  const filtered = events.filter((item) => {
    const searchableText = `
      ${item.name}
      ${item.type.replace("_", " ")}
      ${item.city}
      ${item.state}
      ${item.description}
    `.toLowerCase();

    return keywords.some((word) =>
      searchableText.includes(word)
    );
  });

  setFilteredEvents(filtered);
}, [search, events]);

 //move map function when user clicks on search result or category (not fully implemented yet, but will be used for that)
   const moveToEvent = (event) => {
  if (!event || !currentLocation.current) return;

  console.log("MOVING TO:", event.city, event.state);

  currentLocation.current.animateToRegion({
    latitude: event.latitude,
    longitude: event.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
};

//this will get the user back to their home location
const moveToUserLocation = () => {
  if (!latitude || !longitude || !currentLocation.current) return;

  console.log("MOVING TO USER LOCATION");

  currentLocation.current.animateToRegion({
    latitude, 
    longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
};

const handleSearchSubmit = () => {

  if (!search || !currentLocation.current) return;

  const lowerSearch = search.toLowerCase();

  let locationMatch = null;
//check actual locations  
  const cleanSearch = lowerSearch.trim();

  locationMatch = locations.find((loc) => {
    const city = loc.name?.toLowerCase().trim();
    const state = loc.state?.toLowerCase().trim();

    return (
      cleanSearch === city ||
      cleanSearch === `${city} ${state}` ||
      cleanSearch.includes(city)
    );
  });

if (locationMatch) {
  console.log("MOVING TO LOCATION:", locationMatch.city);

  currentLocation.current.animateToRegion({
    latitude: locationMatch.latitude,
    longitude: locationMatch.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  return; // stop after city match 
}
// if no city match, try event 
if (filteredEvents.length > 0) {
  moveToEvent(filteredEvents[0]);
}
};
  //Google Map background
  return (
    <SafeAreaView style={styles.container}>
      {
        <MapView
          ref={currentLocation}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: latitude || 35.0458, // Chattanooga placeholder
            longitude: longitude || -85.3094,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/*EXAMPLE MAP MARKERS FOR EVENTS/FOOD TRUCKS*/}
        {filteredEvents.map((event) => (
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
        {/*location markers*/}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={loc.name}
            description={loc.state}
            pinColor="green"
          />
        ))}
  
          {/*user location marker*/}
          {latitude && longitude && (
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              title="You are here"
              pinColor="green"
            />
          )}
        </MapView>
      }
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
          onPress={() => router.push("/(app)/events")}
          >
            <Ionicons name="add" size={26} color="#555" />
          </Pressable>

          <Pressable style={styles.locationButton} onPress={moveToUserLocation}>
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

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

    </SafeAreaView>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    errorText: { color: "red", marginBottom: 10},

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

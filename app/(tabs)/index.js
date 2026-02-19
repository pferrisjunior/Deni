// import tools
//use state for screen memory
import React, { useState, useRef } from "react";
import { View, StyleSheet, TextInput, Text, Pressable } from "react-native";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
//safe area tools so the top UI does not go under the iPhone notch/status bar
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// export for the Home Page
export default function HomePage() {
  //map current location memory (ref to control map later)
  const currentLocation = useRef(null);

  //safe area insets (push UI below iPhone notch/status bar)
  const insets = useSafeAreaInsets();

  //user search
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(false);

  //Google Map background
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={currentLocation}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 35.0458, // Chattanooga placeholder
          longitude: -85.3094,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />

      
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
              onChangeText={setSearch}
              placeholder="Looking for something?"
              placeholderTextColor="#666"
              style={styles.searchInput}
              onFocus={() => setSelected(true)}
              onBlur={() => setSelected(false)}
              returnKeyType="search"
            />
          </View>

          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={26} color="#555" />
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
    </SafeAreaView>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

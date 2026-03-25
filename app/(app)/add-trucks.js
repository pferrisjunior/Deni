import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { ref, push, set } from "firebase/database";
import { auth, db } from "../../lib/firebase";

export default function AddTruck() {
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [description, setDescription] = useState("");
  const [menuLink, setMenuLink] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("Account required", "Please sign in first.");
    }
  }, []);

  const handleSubmit = async () => {
    console.log("ADD TRUCK SUBMIT PRESSED");

    try {
      const uid = auth.currentUser?.uid;
      console.log("CURRENT USER UID:", uid);

      if (!uid) {
        throw new Error("User not authenticated");
      }

      const trimmedName = name.trim();
      const trimmedFoodType = foodType.trim();
      const trimmedDescription = description.trim();
      const trimmedMenuLink = menuLink.trim();
      const trimmedLatitude = latitude.trim();
      const trimmedLongitude = longitude.trim();

      console.log("RAW FORM VALUES:", {
        name,
        foodType,
        description,
        menuLink,
        latitude,
        longitude,
      });

      console.log("TRIMMED FORM VALUES:", {
        trimmedName,
        trimmedFoodType,
        trimmedDescription,
        trimmedMenuLink,
        trimmedLatitude,
        trimmedLongitude,
      });

      if (!trimmedName || !trimmedLatitude || !trimmedLongitude) {
        Alert.alert(
          "Missing fields",
          "Truck name, latitude, and longitude are required"
        );
        return;
      }

      const parsedLat = Number(trimmedLatitude);
      const parsedLng = Number(trimmedLongitude);

      console.log("PARSED COORDINATES:", {
        parsedLat,
        parsedLng,
      });

      if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
        Alert.alert(
          "Invalid coordinates",
          "Latitude and longitude must be valid numbers"
        );
        return;
      }

      if (parsedLat < -90 || parsedLat > 90) {
        Alert.alert("Invalid latitude", "Latitude must be between -90 and 90");
        return;
      }

      if (parsedLng < -180 || parsedLng > 180) {
        Alert.alert(
          "Invalid longitude",
          "Longitude must be between -180 and 180"
        );
        return;
      }

      if (
        trimmedMenuLink &&
        !trimmedMenuLink.startsWith("http://") &&
        !trimmedMenuLink.startsWith("https://")
      ) {
        Alert.alert(
          "Invalid menu link",
          "Menu link must start with http:// or https://"
        );
        return;
      }

      const truckRef = push(ref(db, "trucks"));
      console.log("NEW TRUCK REF KEY:", truckRef.key);

      const payload = {
        name: trimmedName,
        foodType: trimmedFoodType,
        description: trimmedDescription,
        menuLink: trimmedMenuLink,
        ownerUid: uid,
        createdByUid: uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type: "food_truck",
        isVerified: false,
        location: {
          lat: parsedLat,
          lng: parsedLng,
        },
      };

      console.log("WRITING TRUCK PAYLOAD:", payload);

      await set(truckRef, payload);

      console.log("TRUCK WRITE SUCCESS:", truckRef.key);

      Alert.alert("Success", "Truck created!");

      setName("");
      setFoodType("");
      setDescription("");
      setMenuLink("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      console.log("ADD TRUCK ERROR:", err);
      Alert.alert(
        "Error",
        err?.message || "Something went wrong while creating the truck"
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Add Truck</Text>
      <Text style={styles.subheader}>Create a new truck for Deni</Text>

      <Text style={styles.label}>Truck Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Burger Bus"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Food Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Tacos, BBQ, Burgers..."
        value={foodType}
        onChangeText={setFoodType}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe the truck or what it serves"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Menu Link</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/menu"
        value={menuLink}
        onChangeText={setMenuLink}
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        placeholder="35.0456"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        placeholder="-85.3097"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Truck</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 160,
    backgroundColor: "#E6C79C",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#E5E5E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#D6C2A1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

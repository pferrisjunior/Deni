
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
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import useGeocoding from "../../hooks/useGeocoding";

export default function AddTruck() {
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [active, setActive] = useState(false)
  const [address, setAddress] = useState("");
  const { geocode, loading, error } = useGeocoding();
  const handleStartPress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: startTime || new Date(),
        mode: "datetime",
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (!event || event.type === "dismissed") return;
          if (selectedDate) setStartTime(selectedDate);
        },
      });
    } else {
      setShowStart(true);
    }
  };

  const handleEndPress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: endTime || new Date(),
        mode: "datetime",
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (!event || event.type === "dismissed") return;
          if (!selectedDate) return;

          if (startTime && selectedDate <= startTime) {
            Alert.alert("Invalid time", "End must be after start");
            return;
          }

          setEndTime(selectedDate);
        },
      });
    } else {
      setShowEnd(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");

      if (!name || !foodType || !description || !address || !startTime || !endTime) {
        Alert.alert(
          "Missing fields",
          "All fields are required (name, food type, description, address, start, end)."
        );
        return;
      }

      if (endTime <= startTime) {
        Alert.alert("Invalid time", "End time must be after start time");
        return;
      }

      const result = await geocode(address);
      if (!result) {
        Alert.alert("Error", "Could not find that address");
        return;
      }

      const { lat, lng } = result;

      if (!lat || !lng) {
        Alert.alert("Error", "Invalid location returned");
        return;
      }

      const payload = {
        name,
        foodType,
        description,
        address,
        active,
        ownerUid: uid,
        createdByUid: uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type: "food_truck",
        isVerified: false,
        location: {
          lat,
          lng,
        },
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
      };

      const truckRef = push(ref(db, "trucks"));
      await set(truckRef, payload);

      Alert.alert("Success", "Truck created!");

      setName("");
      setFoodType("");
      setDescription("");
      setAddress("");
      setStartTime(null);
      setEndTime(null);
      setActive(false);

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
    <Text style={styles.label}>Active</Text>
    <Pressable
      style={styles.input}
      onPress={() => setActive(prev => !prev)}
    >
      <Text>{active ? "Yes" : "No"}</Text>
    </Pressable>
    <Text style={styles.label}>Address</Text>
    <TextInput
      style={styles.input}
      placeholder="123 Main St"
      value={address}
      onChangeText={setAddress}
    />
    <Text style={styles.label}>Start Time</Text>
    <Pressable style={styles.input} onPress={handleStartPress}>
      <Text>
        {startTime ? startTime.toLocaleString() : "Select start time"}
      </Text>
    </Pressable>

    <Text style={styles.label}>End Time</Text>
    <Pressable style={styles.input} onPress={handleEndPress}>
      <Text>
        {endTime ? endTime.toLocaleString() : "Select end time"}
      </Text>
    </Pressable>
    {Platform.OS === "ios" && showStart && (
      <DateTimePicker
        value={startTime || new Date()}
        mode="datetime"
        display="spinner"
        onChange={(event, selectedDate) => {
          if (selectedDate) setStartTime(selectedDate);
        }}
      />
    )}
    {Platform.OS === "ios" && showEnd && (
      <DateTimePicker
        value={endTime || new Date()}
        mode="datetime"
        display="spinner"
        onChange={(event, selectedDate) => {
          if (!selectedDate) return;

          if (startTime && selectedDate <= startTime) {
            Alert.alert("Invalid time", "End must be after start");
            return;
          }

          setEndTime(selectedDate);
        }}
      />
    )}
    <Pressable style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Add a food Truck.</Text>
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


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
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [active, setActive] = useState("")
  const [address, setAddress] = useState("");
  const { geocode, loading, error } = useGeocoding();
  const [showDropdown, setShowDropdown] = useState(false);
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
      const trimmedAddress = address.trim();
      

      console.log("RAW FORM VALUES:", {
        name,
        foodType,
        description,
        
      });

      console.log("TRIMMED FORM VALUES:", {
        trimmedName,
        trimmedFoodType,
        trimmedDescription,
        
      });

      if (!trimmedName || !trimmedAddress ) {
        Alert.alert(
          "Missing fields",
          "Truck name and address required"
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

// app/add-event.js

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { ref, push, set } from "firebase/database";
import { auth, db } from "../../lib/firebase"; // **** adjust path if needed
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import useGeocoding from "../../hooks/useGeocoding";
import { ScrollView } from "react-native";

export default function AddEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [recurring, setRecurring] = useState({
        type: "none"
    });
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
    const handleSubmit = async () => {
        try {
            const uid = auth.currentUser?.uid;
            if (!uid) throw new Error("User not authenticated");
            //will modify when I add geocoding.
            if (!title || !address || !startTime || !endTime) {
                Alert.alert("Missing fields", "Title, address, start, and end time required.");
                return;
            }
            if (endTime <= startTime) {
                Alert.alert("Invalid time", "End time must be after start time");
                return;
            }
            const result = await geocode(address);
            console.log(result)
            if (!result) {
                Alert.alert("Error", "Could not find that address");
                return;
            }

            const { lat, lng } = result;
            console.log("auth.currentUser:", auth?.currentUser);
            console.log("db value:", db);
            console.log("db type:", typeof db);
            const eventRef = push(ref(db, "events"));
            //make the change here when I complete geocoding.
            await set(eventRef, {
                title,
                description,
                startTime: startTime.getTime(),
                endTime: endTime.getTime(),
                createdByUid: uid,
                location: {
                    lat,
                    lng
                },
                address,
                recurring,
            });

            Alert.alert("Success", "Event created!");

            setTitle("");
            setDescription("");
            setAddress("");
            setStartTime(null)
            setEndTime(null)

        } catch (err) {
            Alert.alert("Error", err?.message || "Something went wrong while creating the event");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.header}>Add Event</Text>
            <Text style={styles.subheader}>Create a new event for Deni</Text>

            <Text style={styles.label}>Event Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Night Market"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="What is this event?"
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                placeholder="123 Main St, Chattanooga, TN"
                value={address}
                onChangeText={setAddress}
            />
            <Text style={styles.label}>Recurring</Text>


            <Pressable
                style={styles.input}
                onPress={() => setShowDropdown((prev) => !prev)}
            >
                <Text>
                    {recurring.type === "none"
                        ? "One-time event"
                        : recurring.type === "daily"
                            ? "Daily"
                            : "Weekly"}
                </Text>
            </Pressable>

            {showDropdown && (
                <View style={styles.dropdown}>
                    {[
                        { label: "One-time event", value: "none" },
                        { label: "Daily", value: "daily" },
                        { label: "Weekly", value: "weekly" },
                    ].map((item) => (
                        <Pressable
                            key={item.value}
                            style={styles.dropdownItem}
                            onPress={() => {
                                setRecurring((prev) => ({ ...prev, type: item.value }));
                                setShowDropdown(false);
                            }}
                        >
                            <Text>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
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
                <Text style={styles.buttonText}>Create Event</Text>
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
        textAlign: "center"
    },
    subheader: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30
    },
    label: {
        fontSize: 16,
        marginBottom: 6
    },
    input: {
        backgroundColor: "#E5E5E5",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20
    },
    button: {
        backgroundColor: "#D6C2A1",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600"
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginTop: -10,
        marginBottom: 20,
        elevation: 4,
        zIndex: 1000,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});

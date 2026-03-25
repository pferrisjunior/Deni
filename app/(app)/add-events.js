// app/add-event.js

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { ref, push, set } from "firebase/database";
import { auth, db } from "../../lib/firebase"; // **** adjust path if needed



export default function AddEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    
    const handleSubmit = async () => {
        try {
            const uid = auth.currentUser?.uid;
            if (!uid) throw new Error("User not authenticated");
            
            if (!title || !lat || !lng) {
                Alert.alert("Missing fields", "Title and coordinates are required");
                return;
            }
            
            const parsedLat = Number(lat);
            const parsedLng = Number(lng);
            
            if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
                Alert.alert("Invalid coordinates", "Latitude and longitude must be valid numbers");
                return;
            }
            
            console.log("auth.currentUser:", auth?.currentUser);
            console.log("db value:", db);
            console.log("db type:", typeof db);
            const eventRef = push(ref(db, "events"));
            
            await set(eventRef, {
                title,
                description,
                startTime: Date.now(),
                createdByUid: uid,
                location: {
                    lat: parsedLat,
                    lng: parsedLng
                }
            });
            
            Alert.alert("Success", "Event created!");
            
            setTitle("");
            setDescription("");
            setLat("");
            setLng("");
            
        } catch (err) {
            Alert.alert("Error", err?.message || "Something went wrong while creating the event");
        }
    };
    
    return (
            <View style={styles.container}>
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
            
            <Text style={styles.label}>Latitude</Text>
            <TextInput
            style={styles.input}
            placeholder="35.0456"
            value={lat}
            onChangeText={setLat}
            keyboardType="numeric"
            />
            
            <Text style={styles.label}>Longitude</Text>
            <TextInput
            style={styles.input}
            placeholder="-85.3097"
            value={lng}
            onChangeText={setLng}
            keyboardType="numeric"
            />
            
            <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Event</Text>
            </Pressable>
            </View>
            );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E6C79C"
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
    }
});

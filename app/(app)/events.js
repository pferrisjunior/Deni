//tools
import React from "react";
import { AppText } from "../../components/AppText";
import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { FlatList, Text } from "react-native";
import mockEvents from "../../data/mockEvents";

////export of event screen
export default function EventScreen() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        setEvents(mockEvents);
    }, []);
    
    return (
//main container
     <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.city}, {item.state}</Text>
                    </View>
                )}
            />
        </View>
    );
    }

const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
    },
});

//tools
import React, { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import {ref, query, orderByChild, startAt, get, update, getDatabase} from "firebase/database";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchData = async () => {
    try {
      console.log("fetchData running...");

      const now = Date.now();

      const database = getDatabase();
      const eventsRef = ref(database, "events");

      // querys for startTime and events
      const q = query(
        eventsRef,
        orderByChild("startTime"),
        startAt(now)
      );

      const snapshot = await get(q);

      console.log("snapshot exists:", snapshot.exists());
      console.log("snapshot value:", snapshot.val());
      //gets the data and sorts by id and the value for the start time
      if (snapshot.exists()) {
        const data = snapshot.val();

        const eventList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        
        eventList.sort((a, b) => {
          const aTime = Number(a.startTime) || 0;
          const bTime = Number(b.startTime) || 0;
          return aTime - bTime;
        });

        setEvents(eventList);
      } else {
        setEvents([]);
      }

      setLoaded(true);
    } catch (error) {
      console.log("Database error:", error.message);
      setEvents([]);
      setLoaded(true);
    }
  };

  const handleFirstLayout = () => {
    if (!hasFetched) {
      setHasFetched(true);
      fetchData();
    }
  };
  
  const handleToggleSubscription = async (eventId, isSubscribed) => {
    try {
      if (!user) {
        console.log("No user signed in");
        return;
      }

      const database = getDatabase();
      const updates = {};

      if (isSubscribed) {
        updates[`events/${eventId}/subscribers/${user.uid}`] = null;
      } else {
        updates[`events/${eventId}/subscribers/${user.uid}`] = true;
      }

      await update(ref(database), updates);
      await fetchData();
    } catch (error) {
      console.log("Subscription error:", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onLayout={handleFirstLayout}
    >
      <Text style={styles.title}>Upcoming Events</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshButtonText}>Refresh Events</Text>
      </TouchableOpacity>

      {!loaded ? (
        <Text style={styles.noEvents}>Loading events...</Text>
      ) : events.length === 0 ? (
        <Text style={styles.noEvents}>No upcoming events.</Text>
      ) : (
        events.map((event) => {
          const isSubscribed = !!event.subscribers?.[user?.uid];

          return (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventName}>
                {event.title || "Unnamed Event"}
              </Text>

              <Text style={styles.eventDate}>
                {event.startTime
                  ? new Date(Number(event.startTime)).toLocaleString()
                  : "No date available"}
              </Text>

              <Text style={styles.eventDescription}>
                {event.description || "No description available"}
              </Text>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() =>
                  handleToggleSubscription(event.id, isSubscribed)
                }
              >
                <Text style={styles.subscribeButtonText}>
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noEvents: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
  },
  eventCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  subscribeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UpcomingEvents;
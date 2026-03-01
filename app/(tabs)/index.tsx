import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, Pressable, Alert } from "react-native";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../src/firebase";

import {
  createOrUpdateOwnUserProfile,
  createEvent,
  createTruck,
} from "../../src/services/rtdb";

function withTimeout<T>(p: Promise<T>, ms = 6000) {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timed out")), ms)
    ),
  ]);
}

export default function HomeScreen() {
  const [uid, setUid] = useState<string>("");

  const isLoggedIn = useMemo(() => Boolean(uid), [uid]);

  async function signIn() {
    try {
      const cred = await signInAnonymously(auth);
      setUid(cred.user.uid);
      Alert.alert("Signed in", `UID: ${cred.user.uid}`);
    } catch (e: any) {
      Alert.alert("Sign in failed", String(e?.message ?? e));
    }
  }

  async function runTests() {
    try {
      const results: any[] = [];

      const user = await withTimeout(createOrUpdateOwnUserProfile());
      results.push({
        test: "Write own user via service layer",
        pass: true,
        path: user.path,
      });

      const event = await withTimeout(
        createEvent({
          title: "Created from service layer",
          startTime: Date.now() + 60 * 60 * 1000,
          location: {
            lat: 35.0456,
            lng: -85.3097,
            geohash: "dn4y0",
            name: "Downtown Chattanooga",
          },
        })
      );

      results.push({
        test: "Create event via service layer",
        pass: true,
        path: event.path,
      });

      const truck = await withTimeout(
        createTruck({
          name: "Service Layer Truck",
          location: {
            lat: 35.0456,
            lng: -85.3097,
            geohash: "dn4y0",
          },
        })
      );

      results.push({
        test: "Create truck via service layer",
        pass: true,
        path: truck.path,
      });

      Alert.alert("Service Layer Tests", JSON.stringify(results, null, 2));
    } catch (e: any) {
      Alert.alert("Test run failed", String(e?.message ?? e));
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "600" }}>
          Deni Expo RTDB Test
        </Text>

        <Text style={{ opacity: 0.7, textAlign: "center" }}>
          {isLoggedIn ? `Signed in as ${uid}` : "Not signed in"}
        </Text>

        <Pressable
          onPress={signIn}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 10,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 18 }}>Sign in anonymously</Text>
        </Pressable>

        <Pressable
          onPress={runTests}
          disabled={!isLoggedIn}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 10,
            borderWidth: 1,
            opacity: isLoggedIn ? 1 : 0.4,
          }}
        >
          <Text style={{ fontSize: 18 }}>Run Service Layer Tests</Text>
        </Pressable>

        <Text style={{ opacity: 0.6, textAlign: "center" }}>
          Tests call rtdb service functions. UI does not touch firebase database
          directly.
        </Text>
      </View>
    </SafeAreaView>
  );
}
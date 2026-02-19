import React from "react";
import { SafeAreaView, View, Text, Pressable, Alert } from "react-native";
import { ref, set, get } from "firebase/database";
import { db } from "../../src/firebase";
import { ref, set, get, remove, update } from "firebase/database";


function withTimeout<T>(p: Promise<T>, ms = 4000) {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}


async function writeTestData() {
  const path = "test/hello";
  const payload = { msg: "Deni RTDB write ok", ts: Date.now() };


  try {
    console.log("RTDB: writing to", path, payload);
    await withTimeout(set(ref(db, path), payload), 4000);
    console.log("RTDB: write complete");a

    console.log("RTDB: reading from", path);
    const snap = await get(ref(db, path));
    console.log("RTDB: read complete exists=", snap.exists(), "val=", snap.val());

    Alert.alert(
      "Success",
      snap.exists() ? JSON.stringify(snap.val(), null, 2) : "No data found"
    );
  } catch (err: any) {
    console.log("RTDB: ERROR", err);
    Alert.alert("Write failed", String(err?.message ?? err));
  }
}




export default function HomeScreen() {
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
        <Text style={{ fontSize: 28, fontWeight: "600" }}>Deni Firebase Test</Text>

        <Pressable
          onPress={writeTestData}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 10,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 18 }}>Write Test Data</Text>
        </Pressable>

        <Text style={{ opacity: 0.6, textAlign: "center" }}>
          This writes to test/hello and reads it back.
        </Text>
      </View>
    </SafeAreaView>
  );
}

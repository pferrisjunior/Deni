import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router"
export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); 
    } catch (error) {
      console.log("Logout error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Deni!</Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  btn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnText: { fontSize: 18, fontWeight: "600", color: "#222" },
});




//tools needed
import { AppText } from "../../components/AppText";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ref } from "firebase/database";
import { useId } from "react";
//export screeen
///needs to be swapped for display name but current it appears blank.
export default function ProfileScreen() {
    const handleLogout = async () => {
    try {
      await signOut(auth); 
    } catch (error) {
      console.log("Logout error:", error.message);
    }
  };
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <Text style={styles.header}>Hi, {auth.currentUser.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#111"
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
    });

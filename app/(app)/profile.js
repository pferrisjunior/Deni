//tools needed
import { AppText } from "../../components/AppText";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
//export screeen
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
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

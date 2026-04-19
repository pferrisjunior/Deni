//tools needed
import { AppText } from "../../components/AppText";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useUser } from "../../context/userContext";
//export screeen
export default function ProfileScreen() {
    const { user } = useUser();
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
      <Text style={styles.name}>
        Hello, {user?.displayName || "Loading..."}
      </Text>
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

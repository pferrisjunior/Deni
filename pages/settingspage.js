//tools
import React from "react";
import { View, Text, StyleSheet } from "react-native";
//export settings screen
export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <Text>Settings Page</Text>
    </View>
  );
}
//styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

//tools needed
import React from "react";
import { View, Text, StyleSheet } from "react-native";

//export of screen component
export default function EventPage() {
  return (
    <View style={styles.container}>
      <Text>Events Page</Text>
    </View>
  );
}
//create styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

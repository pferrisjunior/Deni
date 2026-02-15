//import tools
import React from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import { AppText } from "../../components/AppText";
//local image background
const localImage = require("../../assets/map-placeholder.png");
//export for the Home Page
export default function IndexScreen() {
  return (
    <ImageBackground
      source={localImage}
      style={styles.container}
      resizeMode="cover"
    >
      <AppText center style={styles.text}>
        Home
      </AppText>
    </ImageBackground>
  );
}
//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
});

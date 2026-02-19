//tools needed
//needed for component
import React from "react";
//text component to display text
import { Text } from "react-native";
//text component for across app styling
export function AppText({ children, center, style }) {
  return (
    <Text style={[center && { textAlign: "center" }, style]}>
      {children}
    </Text>
  );
}

import React from 'react';
import { View, Text, StyleSheet, ImageBackground} from 'react-native';

const localImage = require("../assets/map-placeholder.png")

export default function HomePage() {
    return (
      <ImageBackground source={localImage} style={styles.container}>
         <Text>Home</Text>
        </ImageBackground>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

//necessary tools to create the stack:

//import React to create component
import React from "react";
//import Stack for navigation structure
import { Stack } from "expo-router";
//import StatusBar to control status bar appearance
import { StatusBar } from "expo-status-bar";

//root layout 
export default function RootLayout() {
    return (
        <>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            </>
    
    );
}
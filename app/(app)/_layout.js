//tools
import React from "react";
import { Tabs } from "expo-router";
//import the AntDesign icons for the tab bar
import AntDesign from "@expo/vector-icons/AntDesign";
//export the tab layout component
export default function TabLayout() {
    return (
    // tab components for the bottom navigator
    //these screen options will apply to all tabs
        <Tabs screenOptions={{ headerShown:false }}>
        <Tabs.Screen
        name="index"
        options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
                <AntDesign name="home" size={size} color={color} />
            )
        }}
       />
       <Tabs.Screen
       name="events"
       options={{
        title: "Events Planner",
        tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={size} color={color} />
        )
       }}
       />

       <Tabs.Screen
       name="profile"
       options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
        )
       }}
    />
    </Tabs>

    );
}
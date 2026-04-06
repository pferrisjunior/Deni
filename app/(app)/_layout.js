import React, { useEffect, useState } from "react";
import { Tabs, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, Alert } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function TabLayout() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsub;
  }, []);

  const requireAuth = (path) => {
    if (!user) {
      Alert.alert(
        "Account required",
        "Please create an account or sign in to use this feature."
      );
      router.push("/login"); // change this if your auth route is different
      return;
    }

    router.push(path);
  };

  return (
    <Tabs screenOptions={{ headerShown: false,
      tabBarStyle: {
          backgroundColor: "#f4ae4c"
      }
    }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events Planner",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="user"
              size={size}
              color={user ? color : "#9CA3AF"}
            />
          ),
          tabBarLabelStyle: {
            color: user ? undefined : "#9CA3AF",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => requireAuth("/profile")}
              style={[props.style, !user && { opacity: 0.65 }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-events"
        options={{
          title: "Add Event",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="plus-circle"
              size={size}
              color={user ? color : "#9CA3AF"}
            />
          ),
          tabBarLabelStyle: {
            color: user ? undefined : "#9CA3AF",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => requireAuth("/add-events")}
              style={[props.style, !user && { opacity: 0.65 }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-trucks"
        options={{
          title: "Add Truck",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="truck"
              size={size}
              color={user ? color : "#111"}
            />
          ),
          tabBarLabelStyle: {
            color: user ? undefined : "#111",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => requireAuth("/add-trucks")}
              style={[props.style, !user && { opacity: 0.99 }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

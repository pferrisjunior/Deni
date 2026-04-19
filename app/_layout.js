import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserProvider, useUser } from "../context/userContext";

GoogleSignin.configure({
  webClientId: "638018823842-l9237c7n2lmb2mfo9a4of667se7em3am.apps.googleusercontent.com",
});

function RootNavigator() {
  const { user, loading } = useUser();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [user, segments, loading]);

  if (loading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}
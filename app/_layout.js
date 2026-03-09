import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getDatabase, ref, get, set, update } from "firebase/database";
GoogleSignin.configure({ webClientId: "638018823842-l9237c7n2lmb2mfo9a4of667se7em3am.apps.googleusercontent.com" });
export default function RootLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();
    useEffect(() => {
        GoogleSignin.configure({ webClientId: "638018823842-l9237c7n2lmb2mfo9a4of667se7em3am.apps.googleusercontent.com" });
    }, []);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const db = getDatabase();
                const userRef = ref(db, "users/" + currentUser.uid);
                const snapshot = await get(userRef);
                if (!snapshot.exists()) {
                    await set(userRef, {
                        createdAt: Date.now(),
                        lastLoginAt: Date.now(),
                        role: "user",
                        displayName: currentUser.displayName || currentUser.email.split("@")[0],
                        email: currentUser.email || "",
                        photoURL: currentUser.photoURL || ""
                    });
                } else {
                    await update(userRef, {
                        lastLoginAt: Date.now()
                    });
                }
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);
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

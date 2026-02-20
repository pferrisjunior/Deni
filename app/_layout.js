//necessary tools to create the stack:
//import React to create component
import React from "react";
//import Stack for navigation structure
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect , useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
//root layout 
export default function RootLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;   
    }, []);
    useEffect(() => {
        if (loading) return;
        const inAuthGroup = segments[0] === "(auth)";
        if (!user && !inAuthGroup) {
            router.replace("/(auth)/login");
        } else if (user && inAuthGroup){
            router.replace("/(app)")
        }
    }, [user, segments, loading]);
    if (loading) return null;
    return <Stack screenOptions={{ headerShown: false }} />;
}
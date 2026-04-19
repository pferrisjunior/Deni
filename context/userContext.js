import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set, update } from "firebase/database";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, "users/" + currentUser.uid);
        try {
          const snapshot = await get(userRef);
          let dbData;
          if (!snapshot.exists()) {
            dbData = {
              createdAt: Date.now(),
              lastLoginAt: Date.now(),
              role: "user",
              displayName:
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "User",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || "",
            };
            await set(userRef, dbData);
          } else {
            const existingData = snapshot.val();
            const updatedDisplayName =
              existingData.displayName ||
              currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "User";
            await update(userRef, {
              lastLoginAt: Date.now(),
              displayName: updatedDisplayName,
            });
            dbData = {
              ...existingData,
              displayName: updatedDisplayName,
            };
          }
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            ...dbData,
          });
        } catch (error) {
          console.error("UserContext error:", error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName:
              currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "User",
            photoURL: currentUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
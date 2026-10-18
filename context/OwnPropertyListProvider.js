// context/OwnPropertyListProvider.js
import { db } from "@/app/firebase/firebase.config";
import { UserContext } from "@/context/guest/UserContext"; // Import UserContext
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// context
export const PropertyContext = createContext();

// provider
export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribeFn, setUnsubscribeFn] = useState(null);

  // Consume profile from UserContext
  const { profile, loading: userLoading } = useContext(UserContext);

  // 🔹 realtime fetch function
  const fetchPropertiesRealtime = async () => {
    // If user profile is not loaded or doesn't have uid, don't fetch
    if (userLoading || !profile?.uid) {
      if (!userLoading) {
        setProperties([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    try {
      const uid = profile.uid;
      console.log('uid for properties fetch:', uid);

      // purana listener band
      if (unsubscribeFn) {
        unsubscribeFn();
      }

      const q = query(
        collection(db, "properties"),
        where("hostId", "==", uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Realtime properties fetched:', list.length);
          setProperties(list);
          setLoading(false);
        },
        (error) => {
          console.log("Property realtime error:", error);
          setLoading(false);
        }
      );

      setUnsubscribeFn(() => unsubscribe);
    } catch (error) {
      console.error("Error in fetchPropertiesRealtime:", error);
      setLoading(false);
    }
  };

  // 🔹 Fetch when profile.uid changes
  useEffect(() => {
    fetchPropertiesRealtime();

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [profile?.uid, userLoading]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        fetchPropertiesRealtime, // 👈 manual refetch
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

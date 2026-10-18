import { db } from "@/app/firebase/firebase.config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { profile, loading: userLoading } = useContext(UserContext);

  useEffect(() => {
    let unsubscribe;

    const fetchUserBookingsRealtime = async () => {
      // Wait for user context to load
      if (userLoading || !profile?.uid) {
        if (!userLoading) setLoading(false);
        return;
      }

      setLoading(true);
      const uid = profile.uid;

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", uid)
      );

      // 🔥 REAL-TIME LISTENER
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const userBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setBookings(userBookings);
          setLoading(false);
        },
        (error) => {
          console.error("Realtime booking error:", error);
          setLoading(false);
        }
      );
    };

    fetchUserBookingsRealtime();

    // 🧹 cleanup listener
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [profile?.uid, userLoading]);

  return (
    <BookingContext.Provider value={{ bookings, loading }}>
      {children}
    </BookingContext.Provider>
  );
};

import { db } from "@/app/firebase/firebase.config";
import { UserContext } from "@/context/guest/UserContext"; // Import UserContext
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

export const AllBookingsContext = createContext();

export const AllBookingsProvider = ({ children }) => {
  const [todayBooking, setTodayBooking] = useState([])
  const [upcomingBooking, setUpcomingBooking] = useState([])
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('all bookings:', bookings)

  // useEffect(() => {
  //   const q = query(
  //     collection(db, "bookings"),
  //     orderBy("createdAt", "desc") // optional but recommended
  //   );

  //   const unsubscribe = onSnapshot(
  //     q,
  //     (snapshot) => {
  //       const allBookings = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setBookings(allBookings);
  //       setLoading(false);
  //     },
  //     (err) => {
  //       console.error("All bookings realtime error:", err);
  //       setError(err);
  //       setLoading(false);
  //     }
  //   );

  //   // cleanup
  //   return () => unsubscribe();
  // }, []);


  // Consume profile from UserContext
  const { profile, loading: userLoading } = useContext(UserContext);
  const [hostPropertyIds, setHostPropertyIds] = useState([]);

  // 1. Fetch Host Properties
  useEffect(() => {
    const fetchHostProperties = async () => {
      if (userLoading || !profile?.uid) return;

      try {
        const q = query(
          collection(db, "properties"),
          where("hostId", "==", profile.uid)
        );
        const snapshot = await getDocs(q);
        const ids = snapshot.docs.map(doc => doc.id);
        setHostPropertyIds(ids);
      } catch (err) {
        console.error("Error fetching host properties for bookings:", err);
      }
    };

    fetchHostProperties();
  }, [profile?.uid, userLoading]);

  // get today booking data from firestore
  const fetchTodayBookings = async () => {
    if (hostPropertyIds.length === 0) {
      setTodayBooking([]);
      return;
    }

    try {
      // Use "in" query for properties (limit 10 for simple implementation)
      const targetIds = hostPropertyIds.slice(0, 10);

      const q = query(
        collection(db, "bookings"),
        where("propertyId", "in", targetIds)
      );

      const snapshot = await getDocs(q);
      const allHostBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter for Today in Memory (Handle Active Stays)
      const now = new Date();
      // UTC YYYY-MM-DD
      const utcDate = now.toISOString().split('T')[0];
      // Local YYYY-MM-DD
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];

      // Helper to check if ANY of our "today" dates fall within booking range
      const isDateInRange = (checkDate, start, end) => {
        return checkDate >= start && checkDate <= end;
      };

      const data = allHostBookings.filter(b => {
        const start = b?.dates?.start;
        const end = b?.dates?.end;
        if (!start || !end) return false;

        // Check if Today (UTC or Local) is inside [start, end]
        return isDateInRange(utcDate, start, end) || isDateInRange(localDate, start, end);
      });

      setTodayBooking(data);
      console.log("active/today bookings:", data.length)
    } catch (error) {
      console.log("Error fetching today bookings:", error);
      setTodayBooking([]);
    }
  };

  // get upcoming data
  const fetchUpcomingBookings = async () => {
    if (hostPropertyIds.length === 0) {
      setUpcomingBooking([]);
      return;
    }

    try {
      const targetIds = hostPropertyIds.slice(0, 10);

      const q = query(
        collection(db, "bookings"),
        where("propertyId", "in", targetIds)
      );

      const snapshot = await getDocs(q);
      const allHostBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter for Upcoming
      const now = new Date();
      const utcDate = now.toISOString().split('T')[0];
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];

      // Upcoming = Start date is strictly greater than today (both UTC and Local to be safe)
      const data = allHostBookings.filter(b => {
        const start = b?.dates?.start;
        if (!start) return false;
        return start > utcDate && start > localDate;
      });

      data.sort((a, b) => (a.dates.start > b.dates.start ? 1 : -1));

      setUpcomingBooking(data);
    } catch (error) {
      console.log("Error fetching upcoming bookings:", error);
      setUpcomingBooking([]);
    }
  };

  useEffect(() => {
    fetchTodayBookings();
    fetchUpcomingBookings();
  }, [hostPropertyIds]);

  return (
    <AllBookingsContext.Provider value={{ bookings, loading, error, todayBooking, upcomingBooking }}>
      {children}
    </AllBookingsContext.Provider>
  );
};

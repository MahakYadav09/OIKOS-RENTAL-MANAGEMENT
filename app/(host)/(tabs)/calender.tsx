// CalendarScreen.js
import { db } from "@/app/firebase/firebase.config";
import { UserContext } from "@/context/guest/UserContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import bookings from "./mockBookings";

type CalendarScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const daysInMonth = today.daysInMonth();
  const monthLabel = today.format("MMMM YYYY");

  const router = useRouter();
  const { profile } = useContext(UserContext);

  const dates = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );

  const [bookingsByDate, setBookingsByDate] = useState<Record<string, number>>({});
  const [hostPropertyIds, setHostPropertyIds] = useState<string[]>([]);

  useEffect(() => {
    // First, fetch all properties owned by this host
    const fetchHostProperties = async () => {
      if (!profile?.uid) return;

      try {
        const propertiesQuery = query(
          collection(db, "properties"),
          where("hostId", "==", profile.uid)
        );

        const snapshot = await getDocs(propertiesQuery);
        const propertyIds = snapshot.docs.map(doc => doc.id);
        setHostPropertyIds(propertyIds);
      } catch (error) {
        console.error("Error fetching host properties:", error);
      }
    };

    fetchHostProperties();
  }, [profile?.uid]);

  useEffect(() => {
    // Only fetch bookings after we have the host's property IDs
    if (hostPropertyIds.length === 0) {
      setBookingsByDate({});
      return;
    }

    // Fetch bookings for the host's properties only
    const q = query(
      collection(db, "bookings"),
      where("dates.end", ">=", startOfMonth.toISOString())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();

        // Filter: Only include bookings for this host's properties
        if (!hostPropertyIds.includes(data.propertyId)) return;

        if (data.status === 'cancelled') return;
        if (!data.dates || !data.dates.start || !data.dates.end) return;

        let current = dayjs(data.dates.start);
        const end = dayjs(data.dates.end);

        // Iterate through each day of the booking
        while (current.isBefore(end) || current.isSame(end, 'day')) {
          const dateStr = current.format("YYYY-MM-DD");
          counts[dateStr] = (counts[dateStr] || 0) + 1;
          current = current.add(1, 'day');
        }
      });

      setBookingsByDate(counts);
    });

    return () => unsubscribe();
  }, [hostPropertyIds]);

  const getBgColor = (count: any) => {
    if (!count) return "#F2F2F2";
    if (count <= 2) return "#E6F4EA";
    return "#FDEAEA";
  };

  const onDatePress = (date: any) => {
    router.push({
      pathname: "/(host)/detail/dateDetail",
      params: { date },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{monthLabel}</Text>

      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      <FlatList
        data={dates}
        numColumns={7}
        keyExtractor={(item) => item.format("YYYY-MM-DD")}
        renderItem={({ item }) => {
          const dateStr = item.format("YYYY-MM-DD");
          const count = bookingsByDate[dateStr] || 0;
          const isToday = item.isSame(today, "day");

          return (
            <TouchableOpacity
              style={[
                styles.dayCell,
                { backgroundColor: getBgColor(count) },
                isToday && styles.today,
              ]}
              onPress={() => onDatePress(dateStr)}
            // onPress={() =>
            //   navigation.navigate("/(host)/detail/dateDetail", {
            //     date: dateStr,
            //   })
            // }
            >
              <Text style={styles.dayText}>{item.date()}</Text>
              <Text style={styles.countText}>{count}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    marginHorizontal: 'auto',
    color: "#000",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDay: {
    width: "14.2%",
    textAlign: "center",
    fontWeight: "500",
    color: "#6B6B6B",
  },
  dayCell: {
    width: "14.2%",
    aspectRatio: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    padding: 4,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  today: {
    borderWidth: 1.5,
    borderColor: "#000",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  countText: {
    fontSize: 10,
    color: "#6B6B6B",
  },
});

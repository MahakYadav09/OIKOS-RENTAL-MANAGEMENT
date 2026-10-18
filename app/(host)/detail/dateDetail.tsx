// BookingDetailsScreen.js
import { db } from "@/app/firebase/firebase.config";
import CheckInCard from "@/components/cards/reservationCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function BookingDetailsScreen() {
    const { date } = useLocalSearchParams();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!date) return;

        const q = query(
            collection(db, "bookings"),
            // Optimization: We could filter by start date here, but for now getting all and filtering in JS 
            // is safer for overlap logic without composite indexes setup immediately.
            // A better query would be: where("dates.start", "<=", date) ... but requires ordering.
            // Let's rely on client-side filtering for simplicity and robustness for small datasets.
        );

        const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const fetchedBookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const targetDate = new Date(date as string);
            targetDate.setHours(0, 0, 0, 0);

            const filtered = fetchedBookings.filter((b: any) => {
                if (!b.dates || !b.dates.start || !b.dates.end) return false;
                const start = new Date(b.dates.start);
                const end = new Date(b.dates.end);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);

                // Check if target date is within range [start, end]
                return targetDate >= start && targetDate <= end;
            });

            setBookings(filtered);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [date]);


    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={25} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>{new Date(date as string).toDateString()}</Text>
                    <Text style={styles.subtitle}>
                        {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                    </Text>
                </View>
                <View style={{ width: 40 }}></View>
            </View>
            {bookings.length === 0 ? (
                <Text style={styles.empty}>No bookings for this date</Text>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <CheckInCard data={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: 20,
                        paddingTop: 20,
                        paddingBottom: 50,
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 60,
    },
    header: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,.05)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B6B6B",
    },
    empty: {
        fontSize: 16,
        color: "#6B6B6B",
        marginTop: 40,
        textAlign: "center",
    },
});

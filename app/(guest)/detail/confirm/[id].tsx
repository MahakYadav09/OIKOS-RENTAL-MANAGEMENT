import { db } from '@/app/firebase/firebase.config'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { doc, getDoc } from 'firebase/firestore'
import { Calendar, ChevronLeft, Download, Moon, Phone, User } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const confirm = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "bookings", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBooking(docSnap.data());
                } else {
                    console.log("No such booking!");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const calculateNights = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    if (!booking) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Booking not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'blue' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const nights = booking.dates ? calculateNights(booking.dates.start, booking.dates.end) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='light' />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(guest)/(tabs)/listing')}>
                    <ChevronLeft size={25} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Enjoy your Stay</Text>
                <View style={{ width: 40, height: 40 }}></View>
            </View>
            <View style={styles.imgContainer}>
                <View style={{ position: 'relative', width: '100%', height: 235, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={{ uri: booking.propertyImage || 'https://via.placeholder.com/300' }} style={styles.imageOne} />
                    <Image source={{ uri: booking.propertyImage || 'https://via.placeholder.com/300' }} style={styles.imageTwo} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', marginHorizontal: 20 }}>{booking.propertyTitle}</Text>
                <Text style={{ fontSize: 14, marginTop: 6, color: 'grey', fontWeight: '500' }}>Booking ID: {id}</Text>
                <Text style={{ fontSize: 24, fontWeight: '600', marginTop: 5 }}>${booking.totalPrice}</Text>
            </View>
            <View style={styles.infoBox}>
                <View style={styles.infoItem}>
                    <View style={styles.icon}>
                        <Calendar size={24} />
                    </View>
                    <Text style={styles.infoText}>
                        {new Date(booking.dates.start).toDateString()} - {new Date(booking.dates.end).toDateString()}
                    </Text>
                </View>

                {/* <View style={styles.infoItem}>
                    <View style={styles.icon}>
                        <MapPin size={24} />
                    </View>
                    <Text style={styles.infoText}>Location come here</Text>
                </View> */}

                <View style={styles.infoItem}>
                    <View style={styles.icon}>
                        <User size={24} />
                    </View>
                    <Text style={styles.infoText}>
                        {booking.guests.adults} Adult, {booking.guests.children} Child
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.icon}>
                        <Moon size={24} />
                    </View>
                    <Text style={styles.infoText}>{nights} {nights > 1 ? 'Nights' : 'Night'}</Text>
                </View>

                <TouchableOpacity style={styles.downloadBtn}>
                    <Download size={24} />
                    <Text style={styles.infoText}>Download Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.callBtn} onPress={()=>router.push(`/(guest)/detail/bookingDetail/${id}`)}>
                    <Text style={[styles.infoText, { color: 'white' }]}>View Detail</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default confirm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    header: {
        paddingHorizontal: 15,
        marginTop: Platform.OS === 'ios' ? 0 : 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,.06)',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgContainer: {
        height: '45%',
        // borderWidth: 1,
        // position: 'relative',
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    imageOne: {
        width: 130,
        height: 190,
        borderRadius: 20,
        transform: "rotate(-10deg)",
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: .2,
        shadowRadius: 18,
        elevation: 10,
        position: 'absolute',
        left: '40%',
        borderWidth: 5,
        borderColor: 'white',
    },
    imageTwo: {
        width: 130,
        height: 190,
        borderRadius: 20,
        transform: "rotate(10deg)",
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: .2,
        shadowRadius: 18,
        elevation: 10,
        position: 'absolute',
        left: '25%',
        borderWidth: 5,
        borderColor: 'white'
    },

    infoBox: {
        height: 'auto',
        width: '92%',
        marginHorizontal: 'auto',
        // borderWidth: 1,
        borderRadius: 40,
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: .2,
        shadowRadius: 18,
        elevation: Platform.OS === 'ios' ? 10 : 5,
        backgroundColor: 'white',
        padding: 15,
        gap: 10,
        marginBottom: Platform.OS == 'android' ? 10 : 0
    },
    icon: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,.1)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14
    },
    infoText: {
        fontSize: 16,
        fontWeight: 500
    },
    downloadBtn: {
        height: 50,
        width: '100%',
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,.05)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flexDirection: 'row'
    },
    callBtn: {
        height: 50,
        width: '100%',
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flexDirection: 'row'
    }
})
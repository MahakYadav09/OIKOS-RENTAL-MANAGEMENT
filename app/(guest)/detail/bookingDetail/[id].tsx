import { db } from '@/app/firebase/firebase.config';
import { BookingContext } from '@/context/guest/BookingListContext';
import { UserContext } from '@/context/guest/UserContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { ChevronDown, ChevronLeftIcon, ChevronUp, Clock, Download, FileText, MapPin, MessageCircle, Phone } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock data for missing fields in the main listing
const DEFAULT_BOOKING_DETAILS = {
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    primaryGuest: 'Raj Parmar',
    roomType: 'Deluxe Suite',
    bedType: 'King Size Bed',
    mealPlan: 'Breakfast Included',
    hotelPhone: '+91 98765 43210',
    hotelAddress: '123, Lake View Road, Venice, Italy',
};

export default function BookingDetailsSheet() {
    const { id } = useLocalSearchParams();
    const { bookings, loading } = useContext(BookingContext);
    const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
    const router = useRouter();
    const { profile } = useContext(UserContext)
    const [cancelling, setCancelling] = useState(false);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    const booking = bookings.find((b: any) => b.id === id);

    if (!booking) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: '#666' }}>Booking not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'blue', fontSize: 16 }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const calculateNights = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    };

    const handleCancelBooking = () => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking? This action cannot be undone.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setCancelling(true);
                            const bookingRef = doc(db, "bookings", id as string);
                            await updateDoc(bookingRef, {
                                status: "cancelled"
                            });
                            alert("Booking cancelled successfully.");
                            router.back();
                        } catch (error) {
                            console.error("Error cancelling booking:", error);
                            alert("Failed to cancel booking.");
                        } finally {
                            setCancelling(false);
                        }
                    }
                }
            ]
        );
    };

    const data = {
        id: booking.id,
        hotelName: booking.propertyTitle,
        location: booking.propertyLocation || "Location Not Available",
        image: booking.propertyImage || 'https://via.placeholder.com/300',
        checkIn: new Date(booking.dates.start).toDateString(),
        checkOut: new Date(booking.dates.end).toDateString(),
        guests: booking.guests,
        price: booking.totalPrice,
        status: booking.status,
        paymentStatus: 'Paid', // Defaulting as logic not yet in DB
        paymentMethod: booking.paymentMethod,
        totalNights: calculateNights(booking.dates.start, booking.dates.end),
        bookedOn: booking.createdAt ? new Date(booking.createdAt.seconds * 1000).toLocaleString() : 'N/A'
    };

    const getStatusColor = (status: string) => {
        switch (status?.trim().toLowerCase()) {
            case 'confirmed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'cancelled': return '#F44336';
            case 'booked': return '#4CAF50';
            default: return '#757575';
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity style={{ padding: 10, backgroundColor: 'white', }} onPress={() => router.back()}>
                    <ChevronLeftIcon size={25} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(data.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(data.status) }]}>
                            {data.status.trim().charAt(0).toUpperCase() + data.status.trim().slice(1)}
                        </Text>
                    </View>
                    <Text style={styles.bookingId}>ID: #{data.id}</Text>
                    <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{data.bookedOn}</Text>
                </View>
                <View style={{ width: 40 }}></View>
            </View>
            <ScrollView style={styles.scrollContent}>
                {/* Hotel Preview */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: data.image }} style={styles.hotelImage} />
                </View>
                <View style={styles.headerLeft}>
                    <Text style={styles.hotelName}>{data.hotelName}</Text>
                </View>
                {/* Stay Details */}
                <View style={[styles.section, styles.stayDetails]}>
                    <View style={styles.stayCol}>
                        <Text style={styles.label}>Check-in</Text>
                        <Text style={styles.dateText}>{data.checkIn}</Text>
                        <Text style={styles.subText}>12:00 AM</Text>
                    </View>

                    <View style={styles.nightBadge}>
                        <View style={styles.nightBadgeInner}>
                            <Text style={styles.nightText}>{data.totalNights} Nights</Text>
                        </View>
                    </View>

                    <View style={[styles.stayCol, { alignItems: 'flex-end' }]}>
                        <Text style={styles.label}>Check-out</Text>
                        <Text style={[styles.dateText, { textAlign: 'right' }]}>{data.checkOut}</Text>
                        <Text style={[styles.subText, { textAlign: 'right' }]}>12:00 AM</Text>
                    </View>
                </View>

                {/* Guest & Room Info */}
                <View style={styles.hostInfoCont}>
                    <Image source={{ uri: `${profile?.profile_image_url}` }} style={styles.hostImage} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.hostName}>You</Text>
                        <Text style={styles.hostLocation}>{data.guests?.adults} Adults, {data.guests?.children} Children</Text>
                    </View>
                </View>

                {/* Host Notes Section */}
                {booking.adminNotes && booking.adminNotes.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Message from Host</Text>
                        {booking.adminNotes.map((note: any) => (
                            <View key={note.id} style={styles.noteItem}>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <MessageCircle size={20} color="#666" style={{ marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.noteText}>{note.text}</Text>
                                        <Text style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Payment Summary */}
                <View style={styles.card}>
                    <View style={styles.rowSpaceBetween}>
                        <Text style={styles.cardTitle}>Total Paid</Text>
                        <Text style={styles.priceText}>${data.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.rowSpaceBetween}>
                        <View style={styles.row}>
                            <Text style={styles.paymentMethod}>{data.paymentMethod}</Text>
                        </View>
                        <View style={[styles.paymentStatus, {
                            backgroundColor: data.paymentStatus === 'Paid' ? '#E8F5E9' : '#FFF3E0'
                        }]}>
                            <Text style={[styles.paymentStatusText, {
                                color: data.paymentStatus === 'Paid' ? '#2E7D32' : '#EF6C00'
                            }]}>{data.paymentStatus}</Text>
                        </View>
                    </View>
                </View>

                {/* Hotel Contact */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hotel Details</Text>
                    <View style={styles.contactRow}>
                        <Phone size={18} color="#666" />
                        <Text style={styles.contactText}>8789433432</Text>
                    </View>
                    <View style={[styles.contactRow, { alignItems: 'flex-start' }]}>
                        <MapPin size={18} color="#666" style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.contactText}>123, MG Road, Bangalore</Text>
                        </View>
                    </View>
                </View>

                {/* Policies Section */}
                <TouchableOpacity
                    style={styles.policiesHeader}
                    onPress={() => setIsPoliciesOpen(!isPoliciesOpen)}
                >
                    <Text style={styles.sectionTitle}>Hotel Policies</Text>
                    {isPoliciesOpen ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                </TouchableOpacity>

                {isPoliciesOpen && (
                    <View style={styles.policiesContent}>
                        <View style={styles.policyItem}>
                            <FileText size={16} color="#666" />
                            <Text style={styles.policyText}>Free cancellation until 24 hours before check-in.</Text>
                        </View>
                        <View style={styles.policyItem}>
                            <Clock size={16} color="#666" />
                            <Text style={styles.policyText}>Check-in: 12:00 PM | Check-out: 11:00 AM</Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 50 }}></View>
            </ScrollView>
            {/* Spacing for sticky bottom buttons */}
            <View style={{ height: 100 }} />


            {/* Sticky Action Buttons */}
            <View style={styles.stickyFooter}>
                <View style={styles.actionRow}>
                    {(data.status.trim().toLowerCase() === 'confirmed' || data.status.trim().toLowerCase() === 'pending') && (
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, cancelling && { opacity: 0.5 }]}
                            onPress={handleCancelBooking}
                            disabled={cancelling}
                        >
                            {cancelling ? <ActivityIndicator size="small" color="#D32F2F" /> : <Text style={styles.cancelButtonText}>Cancel Booking</Text>}
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                        <MessageCircle size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryButtonText}>Contact Hotel</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.secondaryAction}>
                    <Download size={16} color="#666" style={{ marginRight: 6 }} />
                    <Text style={styles.secondaryActionText}>Download Invoice</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 15,
        backgroundColor: '#F9FAFB',
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 80,
        borderBottomWidth: .3,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'white',

    },
    headerLeft: {
        flex: 1,
        paddingRight: 10,
    },
    headerRight: {
        alignItems: 'center',
    },
    hotelName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
        marginTop: 8
    },
    hotelLocation: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookingId: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9E9E9E',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 5,
        position: 'relative',
    },
    hotelImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    hostImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 1,
        resizeMode: 'cover',
    },
    hostName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    hostLocation: {
        fontSize: 13,
        color: '#757575',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 20,
    },
    section: {
        marginBottom: 24,
    },
    stayDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    stayCol: {
        flex: 1,
    },
    hostInfoCont: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 180,
        borderColor: 'rgba(0,0,0,.2)',
        borderWidth: .3,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,

    },
    label: {
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    subText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 2,
    },
    nightBadge: {
        paddingHorizontal: 12,
    },
    nightBadgeInner: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    nightText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#424242',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    row: {
        // flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 20,
    },
    infoTextContainer: {
        marginLeft: 10,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    infoLabel: {
        fontSize: 12,
        color: '#757575',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    priceText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    paymentMethod: {
        fontSize: 14,
        color: '#424242',
    },
    paymentStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    paymentStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactText: {
        fontSize: 15,
        color: '#424242',
        marginLeft: 10,
        flex: 1,
    },
    mapButton: {
        marginTop: 6,
        marginLeft: 10,
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    mapButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1976D2',
    },
    policiesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    policiesContent: {
        marginTop: 4,
        marginBottom: 20,
    },
    policyItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    policyText: {
        fontSize: 14,
        color: '#616161',
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: 30, // For home indicator
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    cancelButtonText: {
        color: '#D32F2F',
        fontWeight: '600',
        fontSize: 15,
    },
    primaryButton: {
        backgroundColor: '#1A1A1A',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    secondaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryActionText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    noteItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    noteText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    }
});

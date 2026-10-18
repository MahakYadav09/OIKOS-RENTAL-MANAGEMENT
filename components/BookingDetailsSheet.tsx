import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ChevronDown, ChevronUp, Clock, CreditCard, Download, FileText, Heart, MapPin, MessageCircle, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface BookingDetailsProps {
    booking: {
        id: string;
        hotelName: string;
        location: string;
        image: string;
        checkIn: string;
        checkOut: string;
        checkInTime?: string;
        checkOutTime?: string;
        guests: {
            adults: number;
            children: number;
            primaryGuest: string;
        };
        roomType?: string;
        bedType?: string;
        mealPlan?: string;
        totalNights: number;
        price: number;
        status: 'confirmed' | 'pending' | 'cancelled';
        paymentStatus: 'Paid' | 'Pending' | 'Refunded';
        paymentMethod: string;
        hotelPhone?: string;
        hotelAddress?: string;
    };
}

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

export default function BookingDetailsSheet({ booking }: BookingDetailsProps) {
    const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

    // Merge passed booking with defaults for demo purposes
    const data = { ...DEFAULT_BOOKING_DETAILS, ...booking, guests: { ...DEFAULT_BOOKING_DETAILS, ...booking.guests } };

    const getStatusColor = (status: string) => {
        switch (status.trim().toLowerCase()) {
            case 'confirmed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'cancelled': return '#F44336';
            default: return '#757575';
        }
    };

    return (
        <View style={styles.container}>
            {/* Draggable Indicator is handled by BottomSheet parent usually, but we can add a visual one if needed inside */}

            <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.hotelName}>{data.hotelName}</Text>
                        <Text style={styles.hotelLocation}>{data.location}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(data.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(data.status) }]}>
                                {data.status.trim().charAt(0).toUpperCase() + data.status.trim().slice(1)}
                            </Text>
                        </View>
                        <Text style={styles.bookingId}>ID: #{data.id}</Text>
                    </View>
                </View>

                {/* Hotel Preview */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: data.image }} style={styles.hotelImage} />
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Heart size={20} color="#fff" fill="rgba(0,0,0,0.5)" />
                    </TouchableOpacity>
                </View>

                {/* Stay Details */}
                <View style={[styles.section, styles.stayDetails]}>
                    <View style={styles.stayCol}>
                        <Text style={styles.label}>Check-in</Text>
                        <Text style={styles.dateText}>{data.checkIn}</Text>
                        <Text style={styles.subText}>{data.checkInTime}</Text>
                    </View>

                    <View style={styles.nightBadge}>
                        <View style={styles.nightBadgeInner}>
                            <Text style={styles.nightText}>{data.totalNights} Nights</Text>
                        </View>
                    </View>

                    <View style={[styles.stayCol, { alignItems: 'flex-end' }]}>
                        <Text style={styles.label}>Check-out</Text>
                        <Text style={styles.dateText}>{data.checkOut}</Text>
                        <Text style={styles.subText}>{data.checkOutTime}</Text>
                    </View>
                </View>

                {/* Guest & Room Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guest & Room</Text>
                    <View style={styles.row}>
                        <View style={styles.infoItem}>
                            <User size={18} color="#666" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Primary Guest</Text>
                                <Text style={styles.infoValue}>{data.guests.primaryGuest}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoValue}>{data.guests.adults} Adults, {data.guests.children} Children</Text>
                        </View>
                    </View>
                    <View style={[styles.row, { marginTop: 12 }]}>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoValue}>{data.roomType} - {data.bedType}</Text>
                            <Text style={styles.subText}>{data.mealPlan}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.card}>
                    <View style={styles.rowSpaceBetween}>
                        <Text style={styles.cardTitle}>Total Paid</Text>
                        <Text style={styles.priceText}>₹{data.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.rowSpaceBetween}>
                        <View style={styles.row}>
                            <CreditCard size={16} color="#666" style={{ marginRight: 6 }} />
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
                        <Text style={styles.contactText}>{data.hotelPhone}</Text>
                    </View>
                    <View style={[styles.contactRow, { alignItems: 'flex-start' }]}>
                        <MapPin size={18} color="#666" style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.contactText}>{data.hotelAddress}</Text>
                            <TouchableOpacity style={styles.mapButton}>
                                <Text style={styles.mapButtonText}>View on Map</Text>
                            </TouchableOpacity>
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

                {/* Spacing for sticky bottom buttons */}
                <View style={{ height: 100 }} />

            </BottomSheetScrollView>

            {/* Sticky Action Buttons */}
            <View style={styles.stickyFooter}>
                <View style={styles.actionRow}>
                    {data.status.trim().toLowerCase() === 'confirmed' && (
                        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerLeft: {
        flex: 1,
        paddingRight: 10,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    hotelName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    hotelLocation: {
        fontSize: 14,
        color: '#757575',
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
        color: '#9E9E9E',
    },
    imageContainer: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    hotelImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    label: {
        fontSize: 12,
        color: '#757575',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 16,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    infoTextContainer: {
        marginLeft: 10,
    },
    infoValue: {
        fontSize: 15,
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
});

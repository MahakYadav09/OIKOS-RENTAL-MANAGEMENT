import BookingModal from '@/components/model/BookingModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import {
    Bath,
    BedDouble,
    Briefcase,
    Car,
    ChevronLeft,
    Coffee,
    CookingPot,
    Dumbbell,
    Fan,
    Flame,
    Heart,
    Leaf,
    MapPin,
    Maximize,
    Microwave,
    Palette,
    ParkingCircle,
    Refrigerator,
    ShieldCheck,
    Snowflake,
    Sparkles,
    Tv,
    Users,
    WashingMachine,
    Waves,
    Wifi
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebase/firebase.config';

// --- MAPPINGS ---

const SPECIALITY_MAP: any = {
    peaceful: { label: "Peaceful", icon: Leaf },
    unique: { label: "Unique", icon: Sparkles },
    family: { label: "Family-friendly", icon: Users },
    stylish: { label: "Stylish", icon: Palette },
    central: { label: "Central", icon: MapPin },
    spacious: { label: "Spacious", icon: Maximize },
};

const AMENITY_MAP: any = {
    wifi: { label: "Wifi", icon: Wifi },
    tv: { label: "TV", icon: Tv },
    kitchen: { label: "Kitchen", icon: CookingPot },
    washer: { label: "Washing machine", icon: WashingMachine },
    workspace: { label: "Dedicated workspace", icon: Briefcase },
    bed_linen: { label: "Bed linens", icon: BedDouble },
    bathtub: { label: "Bathtub", icon: Bath },
    coffee: { label: "Coffee maker", icon: Coffee },
    microwave: { label: "Microwave", icon: Microwave },
    refrigerator: { label: "Refrigerator", icon: Refrigerator },
    free_parking: { label: "Free parking on premises", icon: Car },
    paid_parking: { label: "Paid parking on premises", icon: ParkingCircle },
    ac: { label: "Air conditioning", icon: Snowflake },
    heating: { label: "Heating", icon: Flame },
    fan: { label: "Ceiling fan", icon: Fan },
    security: { label: "Security cameras", icon: ShieldCheck },
    gym: { label: "Gym", icon: Dumbbell },
    pool: { label: "Pool", icon: Waves },
};

const HotelBookingCard = () => {

    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [open, setOpen] = useState(false);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const docRef = doc(db, "properties", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size={'large'} color={'#ff4757'} />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <BookingModal visible={open} onClose={() => setOpen(false)} property={property} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        {isFavorite ? <Heart size={24} color={'red'} /> : <Heart size={24} color={'red'} />}
                    </TouchableOpacity>
                </View>

                {/* Hotel Info */}
                <ScrollView>
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{property?.title}</Text>
                        <View style={styles.locationRow}>
                            <MapPin size={25} color={'#999'} />
                            <Text style={styles.locationText}>{property?.address?.flat}, {property?.address?.streetAddress}, {property?.address?.city}</Text>
                        </View>

                        {/* Speciality Section */}
                        {property.speciality && property.speciality.length > 0 && (
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {property.speciality.map((specKey: string) => {
                                        const item = SPECIALITY_MAP[specKey];
                                        if (!item) return null;
                                        const Icon = item.icon;
                                        return (
                                            <View key={specKey} style={styles.pill}>
                                                <Icon size={16} color="#000" />
                                                <Text style={styles.pillText}>{item.label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        <Text style={styles.description}>
                            {property?.description}
                        </Text>
                    </View>

                    {/* Hotel Image */}
                    <View style={styles.imageContainer}>
                        <ScrollView horizontal>
                            {
                                property?.photos?.map((data: any) => (
                                    <Image
                                        source={{ uri: data }}
                                        style={styles.hotelImage}
                                        resizeMode="cover"
                                    />
                                ))
                            }

                        </ScrollView>
                    </View>

                    {/* hosted by section  */}
                    <View style={styles.hostSection}>
                        <Image source={{ uri: `${property?.hostImage}` }} style={styles.hostImg} />
                        <View style={{ justifyContent: 'center', gap: 2 }}>
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>Hosted by {property?.hostName}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 500, color: 'grey' }}>hosted On {property?.createdAt?.toDate().toDateString()}</Text>
                        </View>
                    </View>

                    {/* Property Details Section */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.detailsTitle}>Property Details</Text>
                        <View style={styles.detailsGrid}>
                            {/* Allowed Guests */}
                            <View style={styles.detailItem}>
                                <Users size={24} color="#ff4757" />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Guests</Text>
                                    <Text style={styles.detailValue}>{property?.basicData?.guest || 'N/A'} guests</Text>
                                </View>
                            </View>

                            {/* Bedrooms */}
                            <View style={styles.detailItem}>
                                <BedDouble size={24} color="#ff4757" />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Bedrooms</Text>
                                    <Text style={styles.detailValue}>{property?.basicData?.bedrooms || 0} bedroom{property?.basicData?.bedrooms !== 1 ? 's' : ''}</Text>
                                </View>
                            </View>

                            {/* Bathrooms */}
                            <View style={styles.detailItem}>
                                  <Bath size={24} color="#ff4757" />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Bathrooms</Text>
                                    <Text style={styles.detailValue}>{property?.basicData?.bathrooms || 0} bathroom{property?.basicData?.bathrooms !== 1 ? 's' : ''}</Text>
                                </View>
                            </View>

                            {/* Property Size */}
                            {property?.basicData?.size && (
                                <View style={styles.detailItem}>
                                    <Maximize size={24} color="#ff4757" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Size</Text>
                                        <Text style={styles.detailValue}>{property?.size} sq ft</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Facilities Section */}
                    <View style={styles.facilitiesSection}>
                        <Text style={styles.facilitiesTitle}>What This Place Offers</Text>
                        {
                            (property?.amenities && property?.amenities.length > 0) ?
                                <View style={styles.facilitiesGrid}>
                                    {property.amenities.map((amenityKey: string) => {
                                        const item = AMENITY_MAP[amenityKey];
                                        // Fallback if amenity key not found in map
                                        if (!item) {
                                            return (
                                                <View key={amenityKey} style={styles.facilityItem}>
                                                    <Text style={styles.facilityText}>{amenityKey}</Text>
                                                </View>
                                            );
                                        }
                                        const Icon = item.icon;
                                        return (
                                            <View key={amenityKey} style={styles.facilityItem}>
                                                <Icon size={24} color="#333" />
                                                <Text style={styles.facilityText}>{item.label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                                :
                                <Text style={{ color: '#666', fontStyle: 'italic' }}>No specific amenities listed.</Text>
                        }
                    </View>
                </ScrollView>
                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceAmount}>₹{property?.price || 0}</Text>
                        <Text style={styles.priceLabel}>/ per night</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton} onPress={() => setOpen(true)}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F2F2F2',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,

    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#333',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        fontSize: 24,
        color: '#ff4757',
    },
    heartFilled: {
        color: '#ff4757',
    },
    hotelInfo: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    hotelName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 10
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#999',
    },
    description: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
    imageContainer: {
        paddingHorizontal: 10,
        marginBottom: 24,
    },
    hotelImage: {
        width: 360,
        minWidth: 300,
        height: 480,
        marginRight: 10,
        borderRadius: 30,
    },
    hostSection: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginHorizontal: 20,
        marginBottom: 20,
        borderColor: 'rgba(0,0,0,.1)',
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 15
    },
    hostImg: {
        width: 55,
        height: 55,
        borderRadius: 50
    },
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.1)',
        paddingBottom: 20,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: '48%',
        gap: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    facilitiesSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    facilitiesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    facilitiesGrid: {
        flexDirection: 'column',
        // flexWrap: 'wrap',
        // justifyContent: 'space-between',
    },
    facilityItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        // backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        // marginBottom: 12,
    },
    facilityIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    facilityText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#F2F2F2',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,.1)',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    priceContainer: {
        flexDirection: 'column',
    },
    priceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    priceLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    bookButton: {
        backgroundColor: '#ff4757',
        paddingVertical: 16,
        paddingHorizontal: 58,
        borderRadius: 30,
        shadowColor: '#ff4757',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f9f9f9",
    },
    pillText: {
        fontSize: 14,
        color: "#333",
    },
});

export default HotelBookingCard;
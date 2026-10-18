import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";
import {
    Bath,
    BedDouble,
    Briefcase,
    Car,
    Coffee,
    CookingPot,
    Dumbbell,
    Fan,
    Flame,
    Microwave,
    ParkingCircle,
    Refrigerator,
    ShieldCheck,
    Snowflake,
    Tv,
    WashingMachine,
    Waves,
    Wifi,
} from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const AMENITIES = [
  // Essentials
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "tv", label: "TV", icon: Tv },
  { id: "kitchen", label: "Kitchen", icon: CookingPot },
  { id: "washer", label: "Washing machine", icon: WashingMachine },
  { id: "workspace", label: "Dedicated workspace", icon: Briefcase },

  // Sleeping & Bath
  { id: "bed_linen", label: "Bed linens", icon: BedDouble },
  { id: "bathtub", label: "Bathtub", icon: Bath },

  // Kitchen extras
  { id: "coffee", label: "Coffee maker", icon: Coffee },
  { id: "microwave", label: "Microwave", icon: Microwave },
  { id: "refrigerator", label: "Refrigerator", icon: Refrigerator },

  // Parking
  { id: "free_parking", label: "Free parking on premises", icon: Car },
  { id: "paid_parking", label: "Paid parking on premises", icon: ParkingCircle },

  // Climate & comfort
  { id: "ac", label: "Air conditioning", icon: Snowflake },
  { id: "heating", label: "Heating", icon: Flame },
  { id: "fan", label: "Ceiling fan", icon: Fan },

  // Safety
  { id: "security", label: "Security cameras", icon: ShieldCheck },

  // Leisure
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "pool", label: "Pool", icon: Waves },
];

interface AmenityCardProps {
    item: typeof AMENITIES[0];
    selected: boolean;
    onPress: () => void;
}

const AmenityCard = ({ item, selected, onPress }: AmenityCardProps) => {
    const Icon = item.icon;
    
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                selected && styles.cardSelected,
            ]}
            activeOpacity={0.8}
        >
            <Icon
                size={28}
                color={selected ? "#000" : "#222"}
                strokeWidth={1.8}
            />
            <Text style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
    );
};

export default function AmenitiesScreen() {

    const [selectedAmenities, setSelectedAmenities] = useState<any>([]);
    const { setAmenities, amenities } = useContext(PropertyOnboardingContext);

    const toggleAmenity = (id: any) => {
        setSelectedAmenities((prev: any) =>
            prev.includes(id)
                ? prev.filter((item: any) => item !== id)
                : [...prev, id]
        );
    };

    useEffect(()=>{
         setAmenities(selectedAmenities)
    },[selectedAmenities])

    return (
        <View style={styles.container}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                <Text style={styles.title}>
                    Tell guests what your place has to offer
                </Text>

                <Text style={styles.subtitle}>
                    You can add more amenities after you publish your listing.
                </Text>

                <Text style={styles.sectionTitle}>
                    What about these guest favourites?
                </Text>

                <FlatList
                    data={AMENITIES}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <AmenityCard
                            item={item}
                            selected={amenities.includes(item.id)}
                            onPress={() => toggleAmenity(item.id)}
                        />
                    )}
                />
            {/* </ScrollView> */}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#000",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B6B6B",
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 16,
        color: "#000",
    },
    list: {
        paddingBottom: 40,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        width: "48%",
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 14,
        padding: 16,
        minHeight: 110,
        justifyContent: "space-between",
        backgroundColor: "#FFF",
    },
    cardSelected: {
        borderColor: "#000",
        backgroundColor: "#F7F7F7",
    },
    cardText: {
        fontSize: 16,
        color: "#000",
        marginTop: 12,
    },
});

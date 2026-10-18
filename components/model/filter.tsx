import Slider from "@react-native-community/slider";
import React, { FC, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    onApplyFilters?: (filters: {
        minPrice: number;
        maxPrice: number;
        bedrooms: number;
        bathrooms: number;
        amenities: Amenity[];
        hotelType: HotelType | null;
    }) => void;
};

type chip = {
    label: any,
    active: any,
    onPress: any
}

type NullableNumber = number;

type Amenity =
    | "Wifi"
    | "Air conditioning"
    | "Kitchen"
    | "Parking";

type HotelType =
    | "Hotel"
    | "Apartment"
    | "Villa"
    | "House"
    | "Resort";

const Chip: FC<chip> = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.chip,
            { borderColor: active ? "#000" : "#ddd" },
        ]}
    >
        <Text style={{ fontWeight: active ? "600" : "400" }}>
            {label}
        </Text>
    </TouchableOpacity>
);

const Divider = () => (
    <View style={styles.divider} />
);

interface PriceBoxProps {
    label: string;
    value: string;
}

const PriceBox: FC<PriceBoxProps> = ({ label, value }) => (
    <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>{label}</Text>
        <Text style={styles.priceValue}>{value}</Text>
    </View>
);


export default function FilterModal({ visible, onClose, onApplyFilters }: Props) {

    // PRICE
    const [minPrice, setMinPrice] = useState<number>(1000);
    const [maxPrice, setMaxPrice] = useState<number>(75000);

    // ROOMS
    const [bedrooms, setBedrooms] = useState<NullableNumber>(0);
    const [beds, setBeds] = useState<NullableNumber>(0);
    const [bathrooms, setBathrooms] = useState<NullableNumber>(0);

    // AMENITIES
    const [amenities, setAmenities] = useState<Amenity[]>([]);

    // HOTEL TYPE
    const [hotelType, setHotelType] = useState<HotelType | null>(null);

    const toggleAmenity = (item: Amenity) => {
        setAmenities((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    };

    const handleApplyFilters = () => {
        if (onApplyFilters) {
            onApplyFilters({
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                amenities,
                hotelType,
            });
        }
        onClose();
    };

    const handleClearAll = () => {
        setMinPrice(1000);
        setMaxPrice(75000);
        setBedrooms(0);
        setBathrooms(0);
        setAmenities([]);
        setHotelType(null);
    };



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose()}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filter</Text>
                        <TouchableOpacity onPress={() => onClose()}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ padding: 15 }}>
                        <Text style={styles.sectionTitle}>Price range</Text>

                        <Slider
                            minimumValue={1000}
                            maximumValue={75000}
                            value={minPrice}
                            onValueChange={(value) => setMinPrice(Math.floor(value))}
                            minimumTrackTintColor="#FF385C"
                        />

                        <Slider
                            minimumValue={1000}
                            maximumValue={75000}
                            value={maxPrice}
                            onValueChange={(value) => setMaxPrice(Math.floor(value))}
                            minimumTrackTintColor="#FF385C"
                        />

                        <View style={styles.priceRow}>
                            <PriceBox label="Minimum" value={`₹${minPrice}`} />
                            <PriceBox label="Maximum" value={`₹${maxPrice}+`} />
                        </View>

                        <Divider />

                        {/* ROOMS & BEDS */}
                        <Text style={styles.sectionTitle}>Rooms and beds</Text>

                        <View style={styles.CounterContainer}>
                            <Text style={styles.label}>Bedrooms</Text>

                            <View style={styles.controls}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        bedrooms === 0 && styles.disabled,
                                    ]}
                                    onPress={() => setBedrooms(bedrooms === null ? 0 : bedrooms - 1)}
                                    disabled={bedrooms === null}
                                >
                                    <Text style={styles.buttonText}>−</Text>
                                </TouchableOpacity>

                                <Text style={styles.value}>
                                    {bedrooms}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.button,
                                    bedrooms === 0 && styles.disabled,
                                    ]}
                                    onPress={() => setBedrooms(bedrooms === null ? 0 : bedrooms + 1)}
                                >
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.CounterContainer}>
                            <Text style={styles.label}>Bathrooms</Text>

                            <View style={styles.controls}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        bedrooms === 0 && styles.disabled,
                                    ]}
                                    onPress={() => setBathrooms(bathrooms === null ? 0 : bathrooms - 1)}
                                    disabled={bathrooms === null}
                                >
                                    <Text style={styles.buttonText}>−</Text>
                                </TouchableOpacity>

                                <Text style={styles.value}>
                                    {bathrooms}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.button,
                                    bathrooms === 0 && styles.disabled,
                                    ]}
                                    onPress={() => setBathrooms(bathrooms === null ? 0 : bathrooms + 1)}
                                >
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Divider />

                        {/* AMENITIES */}
                        <Text style={styles.sectionTitle}>Amenities</Text>

                        <View style={styles.chipsRow}>
                            {["Wifi", "Air conditioning", "Kitchen", "Parking"].map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    active={amenities.includes(item as Amenity)}
                                    onPress={() => toggleAmenity(item as Amenity)}
                                />
                            ))}
                        </View>

                        <Divider />

                        {/* HOTEL TYPE */}
                        <Text style={styles.sectionTitle}>Hotel type</Text>

                        <View style={styles.chipsRow}>
                            {["Hotel", "Apartment", "Villa", "Resort","House"].map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    active={hotelType === item}
                                    onPress={() => setHotelType(item as HotelType)}
                                />
                            ))}
                        </View>

                        {/* BOTTOM SPACE */}
                        <View style={{ height: 40 }} />

                        <TouchableOpacity
                            style={styles.viewItemsButton}
                            onPress={handleApplyFilters}
                        >
                            <Text style={styles.viewItemsText}>Show Places</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    filterButton: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    filterButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        fontSize: 24,
        color: '#000',
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
    },
    optionButtonSelected: {
        backgroundColor: '#000',
    },
    optionText: {
        fontSize: 14,
        color: '#000',
    },
    optionTextSelected: {
        color: '#FFF',
    },
    colorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        gap: 8,
    },
    colorButtonSelected: {
        backgroundColor: '#000',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    colorDotBorder: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    colorText: {
        fontSize: 14,
        color: '#000',
    },
    colorTextSelected: {
        color: '#FFF',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    priceLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    sliderThumbLeft: {
        position: 'absolute',
        left: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#000',
    },
    sliderThumbRight: {
        position: 'absolute',
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#000',
    },
    viewItemsButton: {
        backgroundColor: '#FF385C',
        margin: 16,
        paddingVertical: 18,
        borderRadius: 28,
        alignItems: 'center',
    },
    viewItemsText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    priceBox: {
        width: "48%",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
    },

    priceValue: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4,
    },

    counterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
    },

    counterLabel: {
        fontSize: 16,
    },

    counterControls: {
        flexDirection: "row",
        alignItems: "center",
    },

    circleBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
    },

    counterValue: {
        marginHorizontal: 12,
        minWidth: 30,
        textAlign: "center",
    },

    chipsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    chip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 20,
    },
    CounterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14,
    },

    label: {
        fontSize: 16,
        fontWeight: "400",
    },

    controls: {
        flexDirection: "row",
        alignItems: "center",
    },

    button: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },

    disabled: {
        opacity: 0.4,
    },

    buttonText: {
        fontSize: 18,
        fontWeight: "500",
    },

    value: {
        minWidth: 36,
        textAlign: "center",
        marginHorizontal: 12,
        fontSize: 16,
    },
});
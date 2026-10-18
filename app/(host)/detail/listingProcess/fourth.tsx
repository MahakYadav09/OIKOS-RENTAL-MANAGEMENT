import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";
import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as Location from 'expo-location';

const ConfirmAddressStep = () => {

    const { address, setAddress } = useContext(PropertyOnboardingContext)

    useEffect(() => {
        (async () => {
            // Only fetch if address is empty (or check a specific flag if needed)
            if (address.city || address.pincode) return;

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            
            // Reverse Geocode
            try {
                let reverseGeocoded = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });

                if (reverseGeocoded.length > 0) {
                    const place = reverseGeocoded[0];
                    console.log("Auto-filling address:", place);
                    
                    setAddress((prev: any) => ({
                        ...prev,
                        city: place.city || place.subregion || '',
                        state: place.region || '',
                        pincode: place.postalCode || '',
                        country: place.country || '',
                        streetAddress: place.street || place.name || '',
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }));
                }
            } catch (error) {
                console.log("Error during reverse geocoding:", error);
            }
        })();
    }, []);

    const updateAddressField = (key: any, value: any) => {
        setAddress((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                    >
                        <Text style={styles.title}>Confirm your address</Text>

                        {/* Country */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Country/region</Text>
                            <Text style={styles.value}>{address?.country || 'India'}</Text>
                        </View>

                        {/* Flat / House */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>
                                Flat, house, etc. (if applicable)
                            </Text>
                            <TextInput
                                placeholder="Enter house name"
                                style={styles.input}
                                defaultValue={address?.flat}
                                onChangeText={(text) => updateAddressField("flat", text)}
                            />
                        </View>

                        {/* Street */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Street address</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={address?.streetAddress}
                                onChangeText={(text) => updateAddressField("streetAddress", text)}
                            />
                        </View>

                        {/* Landmark */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>
                                Nearby landmark (if applicable)
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Optional"
                                defaultValue={address?.landmark}
                                 onChangeText={(text) => updateAddressField("landmark", text)}
                            />
                        </View>

                        {/* City */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>City/town</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={address?.city}
                                 onChangeText={(text) => updateAddressField("city", text)}

                            />
                        </View>

                        {/* State */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>
                                State/union territory
                            </Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={address?.state}
                                 onChangeText={(text) => updateAddressField("state", text)}
                            />
                        </View>

                        {/* PIN */}
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>PIN code</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                defaultValue={address?.pincode}
                                 onChangeText={(text) => updateAddressField("pincode", text)}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </KeyboardAwareScrollView>
                {/* <KeyboardToolbar /> */}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default ConfirmAddressStep;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 24,
        color: "#000",
    },

    inputBox: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },

    label: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },

    value: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },

    input: {
        fontSize: 16,
        height: 20,
        color: "#000",
        padding: 0,
    },
});

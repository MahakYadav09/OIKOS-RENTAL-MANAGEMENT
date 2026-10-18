import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Props = {
    visible: boolean;
    onClose: () => void;
};

const SetupModal = ({ visible, onClose }: Props) => {

    const router = useRouter();

    return (
        // <Modal
        //     visible={visible}
        //     animationType="slide"
        //     transparent
        //     onRequestClose={onClose}
        // >
            <SafeAreaView style={styles.container}>
                {/* Header Close Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Ionicons name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.scrollContent}>
                    <Text style={styles.mainTitle}>It's easy to get started on Oikos</Text>

                    {/* Step 1 */}
                    <View style={styles.stepContainer}>
                        <View style={styles.textColumn}>
                            <Text style={styles.stepTitle}>1  Tell us about your place</Text>
                            <Text style={styles.stepSubtitle}>
                                Share some basic info, such as where it is and how many guests can stay.
                            </Text>
                        </View>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2590/2590525.png' }}
                            style={styles.stepImage}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Step 2 */}
                    <View style={styles.stepContainer}>
                        <View style={styles.textColumn}>
                            <Text style={styles.stepTitle}>2  Make it stand out</Text>
                            <Text style={styles.stepSubtitle}>
                                Add 5 or more photos plus a title and description — we'll help you out.
                            </Text>
                        </View>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2662/2662503.png' }}
                            style={styles.stepImage}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Step 3 */}
                    <View style={styles.stepContainer}>
                        <View style={styles.textColumn}>
                            <Text style={styles.stepTitle}>3  Finish up and publish</Text>
                            <Text style={styles.stepSubtitle}>
                                Choose a starting price, verify a few details, then publish your listing.
                            </Text>
                        </View>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png' }}
                            style={styles.stepImage}
                        />
                    </View>
                </View>

                {/* Fixed Bottom Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={()=>router.push('/(host)/detail/listingProcess/hostListingScreen')}>
                        <Text style={styles.buttonText}>Get started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        // </Modal>
    )
}

export default SetupModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        // marginTop: Platform.OS === 'ios' ? 50 : 30,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: 100,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#222222',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 38,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30,
    },
    textColumn: {
        flex: 1,
        paddingRight: 20,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222222',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 16,
        color: '#717171',
        lineHeight: 22,
    },
    stepImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    divider: {
        height: 1,
        backgroundColor: '#EBEBEB',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#E31C5F', // Airbnb brand pink/red
        paddingVertical: 14,
        borderRadius: 40,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
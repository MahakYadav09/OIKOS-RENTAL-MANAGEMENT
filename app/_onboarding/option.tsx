import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RoleSelectionScreen = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with Back Button and Logo */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push('/_onboarding/onboarding')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.backIcon}>
                            <ChevronLeft size={20} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.logoBorder}>
                        <Text style={styles.logoText}>OiKos</Text>
                    </View>

                    <View style={styles.placeholder} />
                </View>

                {/* Role Cards */}
                <View style={styles.cardsContainer}>
                    {/* As Owner Card */}
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                        ]}
                        onPress={() => {
                            setSelectedRole('owner')
                            router.push({ pathname: '/_onboarding/registration', params: { role: 'host' } })
                        }}
                    // activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.cardOverlay}>
                            <Text style={styles.cardText}>As Owner</Text>
                        </View>
                    </TouchableOpacity>

                    {/* As Traveller Card */}
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                        ]}
                        onPress={() => {
                            setSelectedRole('traveller')
                            router.push({ pathname: '/_onboarding/registration', params: { role: 'guest' } })
                        }}
                    // activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800' }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.cardOverlay}>
                            <Text style={styles.cardText}>As Traveller</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Log In Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/_onboarding/login')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        // paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,.05)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 32,
        color: '#1F2937',
        fontWeight: '300',
    },
    logoBorder: {
        borderWidth: 2,
        borderColor: '#EF4444',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EF4444',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 40,
    },
    cardsContainer: {
        flex: 1,
        gap: 20,
        marginBottom: 30,
    },
    roleCard: {
        height: '50%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 4,
        // },
        // shadowOpacity: 0.15,
        // shadowRadius: 8,
        elevation: 5,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 15,
        alignItems: 'center',
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 'auto',
    },
    loginButtonDisabled: {
        borderColor: '#ef4444',
    },
    loginButtonText: {
        color: '#ff0000ff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RoleSelectionScreen;
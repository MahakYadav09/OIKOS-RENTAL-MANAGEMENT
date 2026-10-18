import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { SquarePen, MessageSquareMore } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CheckInCard({data}:any) {

    const router = useRouter();
    return (
        <View style={styles.card}>

            {/* Top Section */}
            <TouchableOpacity style={styles.topSection} onPress={()=>router.push(`/(host)/detail/reservationDetail/${data?.id}`)}>
                <Text style={styles.timeText}>{data?.createdAt?.toDate().toLocaleString()}</Text>

                <Image
                    source={{ uri: data?.guestImage }}
                    style={styles.avatar}
                />

                <Text style={styles.mainTitle}>
                    {data?.guestName}{"\n"}checks in
                </Text>

                <View style={styles.noteContainer}>
                    <SquarePen size={16} color="#919191" />
                    <Text style={styles.noteText}>{data?.adminNote?.length} note</Text>
                </View>
            </TouchableOpacity>

            {/* Bottom Section (Divider integrated via border) */}
            <View style={styles.bottomSection}>
                <View style={styles.textColumn}>
                    <Text style={styles.footerTitle}>Share info about your place</Text>
                    <Text style={styles.footerSubtitle}>Help guests get ready</Text>
                </View>
                <MessageSquareMore size={28} color="#484848" />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '90%',
        backgroundColor: 'white',
        marginHorizontal: 'auto',
        borderRadius: 25,
        marginBottom:20,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        // Shadow for Android
        elevation: Platform.OS === 'android' ? 5 : 0,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        borderWidth: 1,
        borderColor: '#efefef',
    },
    topSection: {
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222222',
        marginBottom: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222222',
        textAlign: 'center',
        lineHeight: 30,
        letterSpacing: -0.5,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    noteText: {
        fontSize: 15,
        color: '#919191',
        fontWeight: '500',
    },
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    textColumn: {
        flex: 1,
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222222',
        marginBottom: 2,
    },
    footerSubtitle: {
        fontSize: 14,
        color: '#717171',
    },
});
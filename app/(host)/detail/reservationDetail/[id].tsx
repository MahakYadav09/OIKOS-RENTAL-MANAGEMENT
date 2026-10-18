import { db } from '@/app/firebase/firebase.config';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function GuestDetailsScreen() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Note System State
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const unsub = onSnapshot(doc(db, "bookings", id as string), (doc) => {
            if (doc.exists()) {
                setBooking({ id: doc.id, ...doc.data() });
            }
            setLoading(false);
        });
        return () => unsub();
    }, [id]);

    const handleCancel = async () => {
        Alert.alert("Cancel Reservation", "Are you sure you want to cancel?", [
            { text: "No", style: "cancel" },
            {
                text: "Yes, Cancel", style: "destructive", onPress: async () => {
                    try {
                        await updateDoc(doc(db, "bookings", id as string), { status: 'cancelled' });
                        router.back();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        ])
    }

    const handleSaveNote = async () => {
        if (!noteContent.trim()) {
            setNoteModalVisible(false);
            return;
        }

        const newNotes = booking.adminNotes ? [...booking.adminNotes] : [];

        if (editingNoteId) {
            // Edit existing
            const index = newNotes.findIndex((n: any) => n.id === editingNoteId);
            if (index > -1) {
                newNotes[index].text = noteContent;
                newNotes[index].updatedAt = new Date().toISOString();
            }
        } else {
            // Add new
            newNotes.push({
                id: uuidv4(),
                text: noteContent,
                createdAt: new Date().toISOString()
            });
        }

        try {
            await updateDoc(doc(db, "bookings", id as string), { adminNotes: newNotes });
            setNoteModalVisible(false);
            setNoteContent('');
            setEditingNoteId(null);
        } catch (error) {
            console.error("Error saving note:", error);
            Alert.alert("Error", "Failed to save note.");
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        Alert.alert("Delete Note", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    const newNotes = booking.adminNotes.filter((n: any) => n.id !== noteId);
                    try {
                        await updateDoc(doc(db, "bookings", id as string), { adminNotes: newNotes });
                    } catch (error) {
                        console.error("Error deleting note:", error);
                        Alert.alert("Error", "Failed to delete note.");
                    }
                }
            }
        ]);
    };

    const openAddNote = () => {
        setNoteContent('');
        setEditingNoteId(null);
        setNoteModalVisible(true);
    };

    const openEditNote = (note: any) => {
        setNoteContent(note.text);
        setEditingNoteId(note.id);
        setNoteModalVisible(true);
    };


    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        )
    }

    if (!booking) {
        return (
            <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Booking not found</Text>
            </SafeAreaView>
        )
    }

    const startDate = new Date(booking.dates.start);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const headerText = diffDays > 0 ? `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}` : (diffDays === 0 ? "Starts today" : "In Progress");

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header Navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{headerText}</Text>
                <TouchableOpacity><Feather name="more-horizontal" size={24} color="black" /></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Overlapping Avatar Group */}
                <View style={styles.avatarContainer}>
                    {/* Placeholder for multiple avatars if needed, currently showing main guest */}
                    <Image source={{ uri: booking.guestImage || 'https://via.placeholder.com/150' }} style={[styles.avatar, styles.avatarMain]} />
                </View>

                {/* Hero Text */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>{booking.guests.adults + booking.guests.children} guests are joining</Text>
                    <Text style={styles.heroDate}>{new Date(booking.dates.start).toDateString()} · {new Date(booking.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    {/* <Text style={styles.heroSubtitle} numberOfLines={1}>Make prints at the world's oldest lithograph...</Text> */}
                </View>

                {/* Card 1: Important Details (From Image 1 Style) */}
                <View style={styles.shadowWrapper}>
                    <View style={styles.cardInner}>
                        <View style={styles.cardRow}>
                            <View style={styles.flex1}>
                                <Text style={styles.cardTitle}>Share important details</Text>
                                <Text style={styles.cardSubtitle}>Help your guests get ready</Text>
                            </View>
                            <MaterialCommunityIcons name="chat-outline" size={28} color="#222" />
                        </View>
                    </View>
                </View>

                <View style={styles.shadowWrapper}>
                    <View style={styles.cardInner}>
                        <View style={styles.cardRow}>
                            <View style={styles.flex1}>
                                <Text style={styles.cardTitle}>Start of stay</Text>
                                <Text style={styles.cardSubtitle}>{new Date(booking.dates.start).toDateString()}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardInner}>
                        <View style={styles.cardRow}>
                            <View style={styles.flex1}>
                                <Text style={styles.cardTitle}>End of stay </Text>
                                <Text style={styles.cardSubtitle}>{new Date(booking.dates.end).toDateString()}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Card 2: Reservation Notes */}
                <View style={styles.shadowWrapper}>
                    <View style={styles.cardInner}>
                        <Text style={styles.sectionTitle}>Reservation notes</Text>

                        {booking.adminNotes && booking.adminNotes.map((note: any) => (
                            <View key={note.id} style={styles.noteItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.noteText}>{note.text}</Text>
                                    <Text style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <View style={styles.noteActions}>
                                    <TouchableOpacity onPress={() => openEditNote(note)} style={{ marginRight: 10 }}>
                                        <Feather name="edit-2" size={18} color="#666" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
                                        <Feather name="trash-2" size={18} color="#FF5A5F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addNoteRow} onPress={openAddNote}>
                            <View style={styles.plusIconContainer}>
                                <Feather name="plus" size={20} color="white" />
                            </View>
                            <Text style={styles.addNoteText}>Add a private note</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card 3: Who's Coming (From Image 2) */}
                <View style={styles.shadowWrapper}>
                    <View style={styles.cardInner}>
                        <Text style={styles.sectionTitle}>Who's coming</Text>

                        {/* Primary Guest */}
                        <GuestRow
                            name={booking.guestName}
                            desc="Primary Guest"
                            uri={booking.guestImage || 'https://via.placeholder.com/150'}
                        />

                        {/* Additional Guests */}
                        {booking.guestNames && booking.guestNames.map((name: string, index: number) => (
                            name ? <GuestRow key={index} name={name} desc="Guest" uri={`https://ui-avatars.com/api/?name=${name}`} /> : null
                        ))}
                    </View>
                </View>

                <View style={{ gap: 10, marginTop: 10 }}>
                    {booking.status === 'pending' && (
                        <TouchableOpacity
                            style={[styles.cancelBtn, { backgroundColor: '#000' }]}
                            onPress={async () => {
                                try {
                                    setLoading(true);
                                    await updateDoc(doc(db, "bookings", id as string), { status: 'booked' });
                                    Alert.alert("Success", "Booking confirmed successfully!");
                                } catch (e) {
                                    console.error(e);
                                    Alert.alert("Error", "Failed to confirm booking.");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>Confirm Booking</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'red' }}> Cancel Reservation</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Note Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={noteModalVisible}
                onRequestClose={() => setNoteModalVisible(false)}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingNoteId ? "Edit Note" : "Add Note"}</Text>
                            <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                                <Feather name="x" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Type your note here..."
                            multiline
                            value={noteContent}
                            onChangeText={setNoteContent}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.saveNoteBtn} onPress={handleSaveNote}>
                            <Text style={styles.saveNoteText}>Save Note</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

// Helper component for Guest List
const GuestRow = ({ name, desc, uri }: { name: string; desc: string; uri: string }) => (
    <View style={styles.guestRow}>
        <Image source={{ uri }} style={styles.guestAvatar} />
        <View>
            <Text style={styles.guestName}>{name}</Text>
            <Text style={styles.guestDesc}>{desc}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    headerTitle:
    {
        fontSize: 16,
        fontWeight: '700'
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },

    // Avatar Group
    avatarContainer: {
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        position: 'absolute',
        borderWidth: 3,
        borderColor: '#fff'
    },
    avatarMain: {
        top: 0,
        zIndex: 3,
        width: 90,
        height: 90,
        borderRadius: 45
    },
    avatarLeft: {
        left: '15%',
        top: 30,
        zIndex: 2
    },
    avatarRight: {
        right: '25%',
        top: 40,
        zIndex: 1,
        width: 60,
        height: 60,
        borderRadius: 30

    },

    // Hero Section
    heroSection: {
        alignItems: 'center',
        marginBottom: 25

    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222'

    },
    heroDate: {
        fontSize: 14,
        color: '#484848',
        marginTop: 8,
        fontWeight: '500'

    },
    heroSubtitle: {
        fontSize: 15,
        color: '#717171',
        marginTop: 4
    },

    // Shadow Fix for iOS
    shadowWrapper: {
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 16,
    },
    cardInner: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        overflow: 'hidden',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center'

    },
    flex1: {
        flex: 1

    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222'

    },
    cardSubtitle: {
        fontSize: 15,
        color: '#717171',
        marginTop: 2

    },

    // Notes Section
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15

    },
    addNoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'

    },
    plusIconContainer: {
        backgroundColor: '#222',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    addNoteText: {
        fontSize: 16,
        color: '#717171'
    },
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9'
    },
    noteText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
        lineHeight: 20
    },
    noteDate: {
        fontSize: 12,
        color: '#999'
    },
    noteActions: {
        flexDirection: 'row',
        marginLeft: 10
    },

    // Guest List
    guestRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    guestAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    guestName: { fontSize: 18, fontWeight: '600', color: '#222' },
    guestDesc: { fontSize: 14, color: '#717171' },

    cancelBtn: {
        width: "100%",
        height: 55,
        backgroundColor: 'rgba(0,0,0,.05)',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    modalInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 20
    },
    saveNoteBtn: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    saveNoteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});
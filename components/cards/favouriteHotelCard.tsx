import { db } from '@/app/firebase/firebase.config';
import { UserContext } from '@/context/guest/UserContext';
import { checkIsFavorite, toggleFavorite } from '@/functions/likeFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { Heart } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FavouriteHotelCard = ({ hotelId }: { hotelId: string }) => {
    const [hotelData, setHotelData] = useState<any>(null);
    console.log(hotelData)
    const router = useRouter();

    const fetchHotelData = async () => {
        try {
            const docRef = doc(db, "properties", hotelId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setHotelData({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error fetching hotel data:", error);
        }
    }

    useEffect(() => {
        if (hotelId) {
            fetchHotelData();
        }
    }, [hotelId])

    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateFavoriteData } = useContext(UserContext);

    const onFavPress = async () => {
        const userId = await AsyncStorage.getItem("uid");
        setLoading(true);
        console.log("click to fav")
        if (!userId || !hotelId) return;

        const res = await toggleFavorite({
            userId: userId,
            propertyId: hotelId,
            isFavorite: isFav,
            updateFavoriteData
        });

        if (res.success) {
            setIsFav(!isFav); // UI instant update
            setLoading(false)
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            const userId = await AsyncStorage.getItem("uid");
            if (!userId || !hotelId) return;
            const res = await checkIsFavorite({
                userId: userId,
                propertyId: hotelId,
            });

            if (res.success) {
                setIsFav(res.isFavorite);
            }
        };

        init();
    }, [hotelId]);

    if (!hotelData) {
        return null; // Or a loader/skeleton
    }

    return (
        <View style={{ marginTop: 20 }}>
            {
                hotelData ?
                    <TouchableOpacity
                        style={styles.card}
                    // onPress={() => router.push(`/(guest)/listing/${hotelData.id}` as any)}
                    >
                        {/* Image */}
                        <View>
                            <Image
                                source={{
                                    uri: hotelData.photos?.[0] || 'https://i.pinimg.com/474x/95/ff/23/95ff2330532f1a04859bb9bc11654adf.jpg',
                                }}
                                style={styles.image}
                            />

                            {
                                isFav ?
                                    <TouchableOpacity style={styles.favBtn} onPress={onFavPress}>
                                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: '50%' }}>
                                            <Heart size={25} color={'white'} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.favBtn} onPress={onFavPress}>
                                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.2)', borderRadius: '50%' }}>
                                            <Heart size={25} color={'white'} />
                                        </View>
                                    </TouchableOpacity>
                            }

                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <View style={styles.row}>
                                <View>
                                    <Text style={styles.hotelName}>{hotelData.title || "Hotel Name here"}</Text>
                                    <Text style={styles.location}>{hotelData.address.flat}, {hotelData.address.city}, {hotelData.address.state}, {hotelData.address.pincode}</Text>
                                </View>

                                <Text style={styles.price}>₹{hotelData.price || "1,920"}</Text>
                            </View>

                            <TouchableOpacity style={styles.noteBtn}>
                                <Text style={styles.noteText}>Add Notes</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    :
                    <View>
                        <Text>Hotel Not Found</Text>
                    </View>
            }
        </View>
    )
}

export default FavouriteHotelCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 30
    },
    heart: {
        position: 'absolute',
        right: 14,
        top: 14,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 50,
    },
    content: {
        // padding: 14,
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hotelName: {
        fontSize: 16,
        fontWeight: '600',
    },
    location: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
    },
    noteBtn: {
        backgroundColor: '#e1e1e1ff',
        marginTop: 12,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    noteText: {
        fontSize: 16,
        fontWeight: 500,
        color: '#444',
    },
    favBtn: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,.3)',
        borderRadius: 50,
        position: 'absolute',
        top: '3%',
        right: '3%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
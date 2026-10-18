import { checkIsFavorite, toggleFavorite } from '@/functions/likeFunctions';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { BedDouble, Heart, MapPin, SquareDashed } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loader from '../loader/loader';
import { UserContext } from '@/context/guest/UserContext';

interface HotelCardProps {
    hotelName?: string;
    location?: string;
    price?: string;
    bedrooms?: number;
    sqft?: string;
    imageUrl?: string;
    hotelId?: string | undefined;
    userId?: string | undefined;
    onPress?: () => void;
}

const HotelCard = ({
    hotelName = "Saket Nagar Hotel",
    location = "Location of the hotel",
    price = "$1200",
    bedrooms = 2,
    sqft = "1232 Sqft",
    imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    onPress,
    hotelId,
    userId
}: HotelCardProps) => {

    const router = useRouter();
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateFavoriteData} = useContext(UserContext);

    const onFavPress = async () => {
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

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/detail/${hotelId}`)}
            activeOpacity={0.9}
        >
            <Loader visible={loading} title={"Adding to favorites..."} />
            <ImageBackground source={{ uri: imageUrl }} style={styles.bgImage}>

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

                <View style={styles.detail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: 500 }}>{hotelName}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 500 }}>{price}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }}>
                        <MapPin size={20} color={'grey'} />
                        <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>{location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <BedDouble size={20} />
                            <Text style={{ fontWeight: 500 }}>{bedrooms} Beds</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <SquareDashed size={20} />
                            <Text style={{ fontWeight: 500 }}>{sqft}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 300,
        marginHorizontal: 'auto',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor:'rgba(0,0,0,.1)'
    },
    bgImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    detail: {
        width: '94%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 12,
        paddingHorizontal: 15,
        paddingVertical: 10
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
});

export default HotelCard;

// Usage Example:
/*
<HotelCard 
  hotelName="Saket Nagar Hotel"
  location="Location of the hotel"
  price="$1200"
  bedrooms={2}
  sqft="1232 Sqft"
  imageUrl="https://your-image-url.com"
  onPress={() => console.log('Card pressed')}
  onFavoritePress={(isFav) => console.log('Favorite:', isFav)}
/>
*/
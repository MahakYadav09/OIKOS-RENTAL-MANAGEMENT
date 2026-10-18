import { BedDouble, Heart, MapPin, SquareDashed } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

interface HotelCardProps {
    hotelName?: string;
    location?: string;
    price?: string;
    bedrooms?: number;
    sqft?: string;
    imageUrl?: string;
    onPress?: () => void;
    onFavoritePress?: (isFavorite: boolean) => void;
}

const ResultCard = ({
    hotelName = "Saket Nagar Hotel",
    location = "Location of the hotel",
    price = "$1200",
    bedrooms = 2,
    sqft = "1232 Sqft",
    imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    onPress,
    onFavoritePress
}: HotelCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const router = useRouter();

    const handleFavoritePress = () => {
        setIsFavorite(!isFavorite);
        if (onFavoritePress) {
            onFavoritePress(!isFavorite);
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/detail/[id]')}
            activeOpacity={0.9}
        >
            <ImageBackground source={{ uri: 'https://i.pinimg.com/736x/f7/ea/59/f7ea59a5378c14c0d10fa4e2e31970fb.jpg' }} style={styles.bgImage}>
                <TouchableOpacity style={styles.favBtn}>
                    <BlurView intensity={5} tint='dark' style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Heart size={25} color={'white'} />
                    </BlurView>
                </TouchableOpacity>

                <BlurView intensity={100} style={styles.detail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: 500, color:'white' }}>{hotelName}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 600, color:'white' }}>{price}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
                        <MapPin size={20} color={'white'} />
                        <Text style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>{location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <BedDouble size={20} color={'white'}/>
                            <Text style={{ fontWeight: 500, color:'white' }}>{bedrooms} Beds</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <SquareDashed size={20} color={'white'} />
                            <Text style={{ fontWeight: 500,color:'white' }}>{sqft}</Text>
                        </View>
                    </View>
                </BlurView>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: Platform.OS === 'android' ? 500 : 440,
        marginHorizontal: 'auto',
        borderRadius: 24,
        overflow: 'hidden'
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
        padding: 20,
        margin: 16,
        textAlign: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor:'black',
        
    },
    favBtn: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,.)',
        borderRadius: 50,
        position: 'absolute',
        top: '3%',
        right: '3%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ResultCard;

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
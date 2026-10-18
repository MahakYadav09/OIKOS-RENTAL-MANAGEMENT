import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';

type Props = {
    imageUrl: string;
    location: string;
};

export default function LocationCard({ imageUrl, location }: Props) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.imageCont}>
                <Image source={{ uri: `${imageUrl}` }} style={styles.image} />
            </View>

            <View style={styles.footer}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.text}>{location}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 200,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 16,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 6,
    },
    text: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    imageCont: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 4, height: 4 },
        elevation: 5,
    }
});

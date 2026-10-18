import { useRouter } from "expo-router";
import { Heart, MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListingCardProps {
  title?: string;
  location?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  dates?: string;
  propertyId?: string;
}

export default function ListingCard({
    title,
    location,
    image,
    rating,
    reviews,
    price,
    dates,
    propertyId
}: ListingCardProps) {

    const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/detail/${propertyId}`)} style={styles.card}>
      {/* Image */}
      <View>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />

        {/* Heart */}
        <TouchableOpacity style={styles.heart}>
          <Heart size={24} color={'white'} />
        </TouchableOpacity>

      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.rating}>★ {rating} ({reviews})</Text>
        </View>

        <View style={styles.subTitle}>
          <MapPin size={18} />
          <Text>
            {location}
          </Text>
        </View>
        <Text style={styles.subTitle}>1 bedroom · 1 bed</Text>
        {/* <Text style={styles.subTitle}>{dates}</Text> */}

        <View style={styles.priceRow}>
          <Text style={styles.newPrice}> {price}</Text>
          <Text style={styles.nights}> for 5 nights</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 25,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  heart: {
    position: "absolute",
    top: 15,
    right: 15,
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    fontSize: 14,
  },
  subTitle: {
    color: "#777",
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#777",
  },
  newPrice: {
    fontWeight: "600",
    fontSize: 18,
  },
  nights: {
    color: "#555",
  },
});

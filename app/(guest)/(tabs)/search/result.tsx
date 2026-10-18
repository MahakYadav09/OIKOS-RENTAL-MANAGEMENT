import { db } from "@/app/firebase/firebase.config";
import ListingCard from "@/components/cards/listingCard";
import FilterModal from "@/components/model/filter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, QueryConstraint, where } from "firebase/firestore";
import { ChevronLeft, SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function HomeScreen() {

  const router = useRouter();
  const { location, startDate, endDate, guests } = useLocalSearchParams<{ location: string, startDate: string, endDate: string, guests: string }>();
  const [open, setOpen] = useState(false);

  // State for properties and loading
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    hotelType: string | null;
  } | null>(null);

  // Search properties from Firestore
  const searchProperties = async () => {
    try {
      setLoading(true);
      const propertiesRef = collection(db, "properties");
      const queryConstraints: QueryConstraint[] = [];

      // IMPORTANT: Firestore allows only ONE range query (>=, <=, >, <) per query
      // We'll use Firestore for exact matches and property type, then filter the rest in memory

      // Property type filter (exact match - safe for Firestore)
      if (filters?.hotelType) {
        queryConstraints.push(where("propertyType", "==", filters.hotelType.toLowerCase()));
      }

      // Amenities filter (array-contains - only one allowed)
      if (filters?.amenities && filters.amenities.length > 0) {
        queryConstraints.push(where("amenities", "array-contains", filters.amenities[0]));
      }

      // Build and execute query
      const q = queryConstraints.length > 0
        ? query(propertiesRef, ...queryConstraints)
        : query(propertiesRef);

      const querySnapshot = await getDocs(q);
      let propertiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // IN-MEMORY FILTERING for all range queries and complex conditions

      // Filter by location (case-insensitive)
      if (location && location.trim() !== '') {
        const searchTerm = location.toLowerCase();
        propertiesData = propertiesData.filter((property: any) => {
          const propertyLocation = (property.address?.city || property.address?.state || property.location || property.city || '').toLowerCase();
          return propertyLocation.includes(searchTerm);
        });
      }

      // NOTE: Date and guest filters are NOT applied - they are for display only
      // Users can see dates and guest count in the header, but properties are not filtered by these

      // Filter by price range
      if (filters) {
        if (filters.minPrice > 1000) {
          propertiesData = propertiesData.filter((property: any) => {
            const price = property.price || property.pricePerNight || 0;
            return price >= filters.minPrice;
          });
        }
        if (filters.maxPrice < 75000) {
          propertiesData = propertiesData.filter((property: any) => {
            const price = property.price || property.pricePerNight || 0;
            return price <= filters.maxPrice;
          });
        }

        // Filter by bedrooms
        if (filters.bedrooms > 0) {
          propertiesData = propertiesData.filter((property: any) => {
            const bedrooms = property.bedrooms || 0;
            return bedrooms >= filters.bedrooms;
          });
        }

        // Filter by bathrooms
        if (filters.bathrooms > 0) {
          propertiesData = propertiesData.filter((property: any) => {
            const bathrooms = property.bathrooms || 0;
            return bathrooms >= filters.bathrooms;
          });
        }

        // Filter for remaining amenities (after first one in Firestore query)
        if (filters.amenities && filters.amenities.length > 1) {
          propertiesData = propertiesData.filter((property: any) => {
            const propertyAmenities = property.amenities || [];
            return filters.amenities.every((amenity: string) =>
              propertyAmenities.includes(amenity)
            );
          });
        }
      }

      setProperties(propertiesData);
      console.log("Fetched properties:", propertiesData.length);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties on mount and when search params or filters change
  useEffect(() => {
    searchProperties();
  }, [location, startDate, endDate, guests, filters]);

  // Handle filter application
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const dateRange = startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : 'Any week';
  const guestsText = guests && parseInt(guests) > 0 ? `${guests} guest${parseInt(guests) > 1 ? 's' : ''}` : 'Add guests';

  return (
    <SafeAreaView style={styles.container}>
      <FilterModal visible={open} onClose={() => setOpen(false)} onApplyFilters={handleApplyFilters} />
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.title}>{location ? `Homes in ${location}` : 'Homes'}</Text>
          <Text style={styles.subtitle}>{dateRange} · {guestsText}</Text>
        </View>

        {/* Filter Button Placeholder */}
        <TouchableOpacity style={styles.filterBtn} onPress={() => setOpen(true)}>
          <SlidersHorizontal size={24} />
        </TouchableOpacity>
      </View>
      {
        loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF385C" />
            <Text style={{ marginTop: 10, fontSize: 16, color: '#777' }}>Searching properties...</Text>
          </View>
        ) : properties.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Image source={require('../../../../assets/images/no-location.png')} style={{ width: 180, height: 150 }} />
            <Text style={{ fontSize: 16, fontWeight: 500, fontFamily: 'NunitoSans_700Bold', }}>No Homes Found</Text>
            <TouchableOpacity style={{ paddingHorizontal: 30, paddingVertical: 12, backgroundColor: 'black', borderRadius: 10, marginTop: 10 }} onPress={() => router.back()}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={{ paddingHorizontal: 5, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {/* Render properties dynamically from Firestore */}
            {properties.map((property: any) => (
              <ListingCard
                key={property.id}
                propertyId={property.id}
                title={property.title || property.name || 'Property'}
                location={property.location || property.city || 'Unknown'}
                price={`₹${property.price || property.pricePerNight || 0}`}
                rating={property.rating || 4.5}
                reviews={property.reviews || property.reviewCount || 0}
                image={property.image || property.photos?.[0] || property.imageUrl}
              />
            ))}
          </ScrollView>
        )
      }

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 50,

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 22,
  },

  searchBox: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
  },

  filterIconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  priceBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

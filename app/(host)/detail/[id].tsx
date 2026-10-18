import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ChevronLeft, Trash } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase/firebase.config";

const ListingEditorScreen: React.FC = () => {

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          console.log(docSnap.data())
        } else {
          router.back()
          console.log("No such document!");
          setListing(null);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const deleteFirestoreDoc = async () => {
    setLoading(true)
    try {
      const docRef = doc(db, "properties", id as string);
      await deleteDoc(docRef);

      console.log("Document deleted successfully");
      setLoading(false)
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      setLoading(false)
      return false;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing not found</Text>
          <View style={{ width: 40 }}></View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Listing not found or invalid ID.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={25} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing editor</Text>
        <View style={{ width: 40 }}></View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>Your space</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Arrival guide</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Tour */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Photo tour</Text>
          <Text style={styles.subText}>
            {listing.basicData.bedrooms || 0} bedroom · {listing.basicData.beds || 0} bed · {listing.basicData.bathrooms || 0} baths
          </Text>

          <Image
            source={{
              uri: listing.photos?.[0] || "https://picsum.photos/400/250",
            }}
            style={styles.photo}
          />

          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>
              {listing.photos?.length || 0} photos
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Title</Text>
          <Text style={[styles.valueText, { fontSize: 24, fontWeight: 600, color: '#999999' }]}>{listing.title || "No Title"}</Text>
        </View>

        {/* Property Type */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property type</Text>
          <Text style={styles.valueText}>{listing.propertyType || listing.type || "Home"}</Text>
        </View>

        {/* Pricing */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing</Text>
          <Text style={styles.valueText}>₹{listing.price || 0} per night</Text>
          <Text style={styles.subText}>
            ₹{listing.weekendPrice || listing.price} weekend price
          </Text>
          <Text style={styles.subText}>10% weekly discount</Text>
        </View>

        {/* Availability */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability</Text>
          <Text style={styles.valueText}>1–365 night stays</Text>
          <Text style={styles.subText}>Same-day advance notice</Text>
        </View>

        {/* Guests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Number of guests</Text>
          <Text style={styles.valueText}>{listing.guests || 1} guests</Text>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.subText}>
            {listing.description || "No description provided."}
          </Text>
        </View>

        {/* Amenities */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Amenities</Text>
          {
            listing.amenities?.length > 0 ? (
              <Text style={styles.subText}>{listing.amenities.join(", ")}</Text>
            ) : (
              <Text style={styles.subText}>No Amenities</Text>
            )
          }
        </TouchableOpacity>

        {/* Accessibility */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Accessibility features</Text>
          <Text style={styles.subText}>Add details</Text>
        </TouchableOpacity>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: "#666" }}>Map Preview</Text>
          </View>
          <Text style={styles.subText}>
            {/* {listing.address || listing.location || "No address provided"} */}
            {listing.address.flat}, {listing.address.city}, {listing.address.state}
          </Text>
        </View>

        {/* Host */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About the host</Text>
          <View style={styles.hostRow}>
            <Image
              source={{ uri: listing.hostImage || "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.valueText}>{listing.hostName || "Host"}</Text>
              <Text style={styles.subText}>Started hosting in {listing.hostJoinedYear || "2026"}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={deleteFirestoreDoc} style={styles.deleteButton}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>
            Delete Property</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingEditorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  back: { fontSize: 18 },
  settings: { fontSize: 18 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#eee",
    margin: 12,
    borderRadius: 30,
    padding: 4,
    width: '70%',
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: { color: "#666" },
  activeTabText: {
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 1, height: 3 },
    shadowColor: '#656565ff',
    shadowOpacity: 0.25,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  valueText: {
    fontSize: 15,
    marginTop: 4,
  },
  subText: {
    color: "#777",
    marginTop: 4,
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'capitalize'
  },

  requiredDot: {
    fontWeight: "600",
    color: "#d00",
  },

  photo: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 12,
  },
  photoBadge: {
    position: "absolute",
    right: 20,
    top: 90,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  photoBadgeText: {
    color: "#fff",
    fontSize: 12,
  },

  mapPlaceholder: {
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: "#d00",
    paddingVertical: 20,
    borderRadius: 30,
    marginHorizontal: 15,
    marginTop: 25,
    alignItems: "center",
  },
});

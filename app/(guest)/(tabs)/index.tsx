import LocationCard from '@/components/cards/card';
import HotelCard from '@/components/cards/hotelCard';
import { UserContext } from '@/context/guest/UserContext';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { Bell, Building2, Castle, ChevronRight, Hotel } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase/firebase.config';
import { PropertyListContext } from '@/context/guest/PropertyListContext';
import PopupModal from '@/components/bottomModel';

const HomeScreen = () => {

  const { properties } = useContext(PropertyListContext);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'Hotels', name: 'Hotels', icon: '🏨' },
    { id: 'Apartments', name: 'Apartments', icon: '🏢' },
    { id: 'Villas', name: 'Villas', icon: '🏠' }
  ];

  const location = [
    { id: 1, name: 'Venice, Italy', image: 'https://i.pinimg.com/736x/a2/88/c4/a288c4e320aea8c9563ee0b8f74a2ade.jpg' },
    { id: 2, name: 'Amsterdam, Netherlands', image: 'https://i.pinimg.com/736x/3f/fb/c1/3ffbc1810e3260bcaf44f7bdd85a2258.jpg' },
    { id: 3, name: 'London, United Kingdom', image: 'https://i.pinimg.com/1200x/dd/74/75/dd7475a2104cfdae3254659a2e68a4f3.jpg' },
    { id: 4, name: 'Bali, Indonesia', image: 'https://i.pinimg.com/736x/c2/90/f8/c290f85f54dfbfe151d2969eac78a917.jpg' },
    { id: 5, name: 'Tokyo, Japan', image: 'https://i.pinimg.com/1200x/da/37/ec/da37ec27327a984e0cc6ee8fd77a1816.jpg' },
    { id: 6, name: 'Maldives', image: 'https://i.pinimg.com/736x/3b/bf/fb/3bbffba9cd0ada89dcf9a31af8403618.jpg' },
  ];

  const { profile } = useContext(UserContext)
  const router = useRouter();

  useEffect(() => {
    if (profile?.role === 'traveller') {
      router.push('/(guest)/(tabs)')
    } else {
      router.push('/(host)/(tabs)')
    }
  }, [profile])


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBorder}>
          <Text style={styles.logoText}>OiKos</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.bellIcon}>
              <Bell size={25} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, }}>
        <Image source={require('../../../assets/images/banner.jpg')} style={{ width: '94%', height: 160, marginHorizontal: 'auto', marginTop: 10, borderRadius: 20 }} />
        <ScrollView
          horizontal={true}
          style={{ paddingHorizontal: 15, paddingVertical: 10 }}
          contentContainerStyle={{
            gap: 10
          }}
        >
          <TouchableOpacity style={styles.filterCard}>
            <Building2 size={24} />
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Hotel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterCard}>
            <Hotel size={24} />
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Apartment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterCard}>
            <Castle size={24} />
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Vila</Text>
          </TouchableOpacity>
        </ScrollView>
        <View>
          <View style={{ width: '92%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 'auto', marginTop: 0 }}>
            <Text style={{ fontSize: 16, fontWeight: 500, color: 'grey' }}>Top Destinations</Text>
            <ChevronRight size={25} />
          </View>
        </View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ gap: 10 }}
          style={{ marginHorizontal: 10, marginTop: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {
            location.map((item) => (
              <LocationCard
                imageUrl={item.image}
                location={item.name}
              />
            ))
          }
        </ScrollView>
        <View>
          <View style={{ width: '92%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 'auto', marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 500, color: 'grey' }}>Recent Hotels</Text>
            <ChevronRight size={25} />
          </View>
          <View style={{ width: '93%', marginHorizontal: 'auto', marginTop: 10, marginBottom: 20, gap: 20 }}>
            {properties?.length === 0 ? (
              <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#e00b00ff" />
              </View>
            ) : (
              properties?.map((item: any) => (
                <HotelCard
                  key={item.id}
                  userId={profile?.uid}
                  hotelId={item.id}
                  hotelName={item.title}
                  location={item.address?.city || item.location}
                  price={`₹${item.price}`}
                  bedrooms={item.basicData?.bedrooms || item.bedrooms}
                  sqft={`${item.basicData?.homeArea || 0} Sqft`}
                  imageUrl={item.photos?.[0] || item.images?.[0]}
                  onPress={() => router.push(`/(host)/detail/${item.id}` as any)}
                />
              ))
            )}
            {/* <HotelCard /> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
  },
  logoBorder: {
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 22,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  filterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 50,
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  loadscreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'white',
    zIndex: 1000
  }
});

export default HomeScreen;
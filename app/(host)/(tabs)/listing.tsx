import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PropertyOnboardingContext } from '@/context/host/propertyOnboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropertyContext } from '@/context/OwnPropertyListProvider'


export default function YourListingsScreen() {

  const [data, setData] = useState(0)

  const router = useRouter();

  const { loadDraft, draftChange } = useContext(PropertyOnboardingContext)
  const { properties } = useContext(PropertyContext)
  console.log(properties)

  const resumestep = async () => {
    const resumeStep = await loadDraft();
    console.log('resume step:', resumeStep)
    // setStep(resumeStep);
  }

  const [draft, setDraft] = useState<any>(null);
  const PROPERTY_DRAFT_KEY = 'PROPERTY_DRAFT_V1';

  useEffect(() => {
    fetchDraft();
  }, []);
  useEffect(() => {
    fetchDraft();
  }, [draftChange]);

  const fetchDraft = async () => {
    const saved = await AsyncStorage.getItem(PROPERTY_DRAFT_KEY);
    if (saved) {
      setDraft(JSON.parse(saved));
    }
  };
  console.log('draft data', draft)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your listings</Text>
        <View style={styles.headerIcons}>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/(host)/detail/listingProcess/startSetup")}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {
        properties.length === 0 && !draft && (
          <View style={draft ? { display: 'none' } : { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
            <Image source={{ uri: "https://i.pinimg.com/736x/1a/55/ad/1a55ad12640a86cea9277c19cbc8b37f.jpg" }} style={{ width: 130, height: 130, borderRadius: 15 }} />
            <Text style={{ width: '80%', textAlign: 'center', fontSize: 16, fontWeight: 500 }}>Create a Listing with Oikos setup and start getting booked</Text>

            <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10 }} onPress={() => router.push("/(host)/detail/listingProcess/startSetup")}>
              <Text style={{ fontSize: 16, fontWeight: 600 }}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )
      }
      {
        draft && (
          <TouchableOpacity onPress={() => router.push('/(host)/detail/listingProcess/hostListingScreen')}>
            <View style={styles.draftCard}>
              {draft?.data?.photos?.length > 0 ? (
                <ImageBackground
                  imageStyle={{
                    borderRadius: 20,
                  }}
                  source={{ uri: draft.data.photos[0] }}
                  style={{ width: '100%', height: 260, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 }}
                >
                  <Text style={styles.actionBtn}>
                    Action Required
                  </Text>
                </ImageBackground>
              ) :
                <View style={{ width: '100%', height: 260, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 }}>
                  <Text style={styles.actionBtn}>
                    Action Required
                  </Text>
                </View>
              }
              <Text style={styles.title}>{draft?.data?.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: 500, marginTop: -22 }}>{draft?.data?.description}</Text>
            </View>
          </TouchableOpacity>
        )
      }
      {
        properties?.map((data: any, index: any) => {
          return (
            <TouchableOpacity onPress={()=>router.push(`/(host)/detail/${data?.id}`)}>
            <View style={styles.draftCard}>
              {data?.photos?.length > 0 ? (
                <ImageBackground
                  imageStyle={{
                    borderRadius: 20,
                  }}
                  source={{ uri: data?.photos[0] }}
                  style={{ width: '100%', height: 260, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 }}
                >
                </ImageBackground>
              ) :
                <View style={{ width: '100%', height: 260, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 }}>
                  <Text style={styles.actionBtn}>
                    Action Required
                  </Text>
                </View>
              }
              <Text style={styles.title}>{data?.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{data?.description}</Text>
            </View>
          </TouchableOpacity>
          )
        })
      }
      {/* {
        data === 0 || draft?.lenght !== 0 ?
          <View style={draft ? { display: 'none' } : { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
            <Image source={{ uri: "https://i.pinimg.com/736x/1a/55/ad/1a55ad12640a86cea9277c19cbc8b37f.jpg" }} style={{ width: 130, height: 130, borderRadius: 15 }} />
            <Text style={{ width: '80%', textAlign: 'center', fontSize: 16, fontWeight: 500 }}>Create a Listing with Oikos setup and start getting booked</Text>

            <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10 }} onPress={() => router.push("/(host)/detail/listingProcess/startSetup")}>
              <Text style={{ fontSize: 16, fontWeight: 600 }}>Get Started</Text>
            </TouchableOpacity>
          </View>
          :
         ''
      } */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#222222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1.1, // Matches the square-ish rounded look in the image
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E37E24', // Orange "In progress" color
    marginRight: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },
  listingDateText: {
    fontSize: 16,
    color: '#222222',
    marginTop: 10,
    fontWeight: '500',
  },
  draftCard: {
    width: '90%',
    marginHorizontal: 'auto',
    marginTop: 10,
    height: 'auto',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 10
  },
  actionBtn: {
    paddingVertical: 10,
    backgroundColor: 'white',
    width: 140,
    marginLeft: 15,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 600,
    borderRadius: 20
  }
});
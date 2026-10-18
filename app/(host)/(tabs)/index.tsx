import CheckInCard from '@/components/cards/reservationCard';
import { UserContext } from '@/context/guest/UserContext';
import { AllBookingsContext } from '@/context/host/AllBookingsContext';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const TodayScreen = ({ todayBooking }: any) => {

  const { profile } = useContext(UserContext);
  console.log("profile", profile)

  const router = useRouter();
  useEffect(() => {
    if (profile?.role === 'host') {
      router.replace('/(host)/(tabs)')
    } else {
      router.replace('/(guest)/(tabs)')
    }
  }, [profile])

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 20, }} contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 600, marginBottom: 30, width: '70%', textAlign: 'center' }}>You Have {todayBooking?.length} Reservation Today</Text>
      {
        todayBooking?.map((data: any) => {
          return (
            <CheckInCard data={data} />
          )
        })
      }
    </ScrollView>
  )
}

const UpcomingScreen = ({ upcomingBooking }: any) => {

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 20, }} contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 600, marginBottom: 30, width: '70%', textAlign: 'center' }}>You Have {upcomingBooking?.length} Upcoming Reservation</Text>
      {
        upcomingBooking?.map((data: any) => {
          return (
            <CheckInCard data={data} />
          )
        })
      }
    </ScrollView>
  )
}

const HomeScreen = () => {

  const [active, setActive] = useState('today')
  const { loading, todayBooking, upcomingBooking } = useContext(AllBookingsContext);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={active === 'today' ? styles.activeTab : styles.tab} onPress={() => setActive('today')}>
          <Text style={active === "today" ? { color: 'white', fontSize: 15, fontWeight: 500 } : { color: 'black', fontSize: 15, fontWeight: 500 }}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={active === 'upcoming' ? styles.activeTab : styles.tab} onPress={() => setActive('upcoming')} >
          <Text style={active === "upcoming" ? { color: 'white', fontSize: 15, fontWeight: 500 } : { color: 'black', fontSize: 15, fontWeight: 500 }}>Upcoming</Text>
        </TouchableOpacity>
      </View>
      {
        active === 'today' ?
          <TodayScreen todayBooking={todayBooking} />
          :
          <UpcomingScreen upcomingBooking={upcomingBooking} />
      }
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 65,
    gap: 10,
    paddingBottom: 12,
  },
  activeTab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgb(75, 75, 75)',
    borderRadius: 20
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,.06)',
    borderRadius: 20
  }
});

export default HomeScreen;
import BookingDetailsSheet from '@/components/BookingDetailsSheet';
import { BookingContext } from '@/context/guest/BookingListContext';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function MyBookingsScreen() {
  // const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const userId = 'CURRENT_USER_ID'; // auth se lo

  const { bookings } = useContext(BookingContext);

  const BOOKINGS = [
    {
      id: '1',
      hotelName: 'Grand Venice Hotel',
      location: 'Venice, Italy',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      checkIn: '15 Feb 2025',
      checkOut: '18 Feb 2025',
      guests: {
        adults: 2,
        children: 0,
        primaryGuest: 'Raj Parmar'
      },
      price: 1794000,
      status: 'confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      totalNights: 3,
    },
  ];

  const BottomSheetRef = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ["55%", "90%"], []);

  const openSheet = (booking: any) => {
    setSelectedBooking(booking);
    BottomSheetRef.current?.snapToIndex(1);
  };

  const backDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const getStatusColor = (status: string) => {
    switch (status?.trim().toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'booked': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10
        }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => {
            router.push(`/detail/bookingDetail/${item.id}`);
          }} >
            <Image source={{ uri: item.propertyImage }} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.title}>{item.propertyTitle}</Text>
              <Text style={styles.location}>{item.propertyLocation}</Text>
              <View style={{ width: '100%', height: 1, backgroundColor: '#f2f2f2ff', marginVertical: 6 }}></View>
              <Text style={styles.date}>{item.dates.start} - {item.dates.end}</Text>
              <Text style={styles.date}>{item.guests.adults} Adults, {item.guests.children} Children</Text>

              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status.trim().charAt(0).toUpperCase() + item.status.trim().slice(1)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* <BottomSheet
        ref={BottomSheetRef}
        snapPoints={snapPoint}
        index={-1}
        backdropComponent={backDrop}
        enablePanDownToClose
      >
        <BottomSheetView style={{ flex: 1 }}>
          {selectedBooking && <BookingDetailsSheet booking={selectedBooking} />}
        </BottomSheetView>
      </BottomSheet> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    paddingHorizontal: 16,
    paddingTop: 70,
    backgroundColor: '#f2f2f2ff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    // alignSelf:'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 35,
    height: 'auto',
    width: "100%",
    padding: 8,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 30
  },
  statusBadge: {
    marginTop:10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    marginBottom: 4,
    width:'100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 5
  },
  location: {
    fontSize: 12,
    color: "#777",
    // alignSelf:'center',
    marginBottom: 10
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
    // alignSelf:'center',
    fontWeight: 500
  },
  status: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ffe1e1ff',
    padding: 10,
    borderRadius: 40,
    marginTop: 6
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: 'red',
    textTransform: 'capitalize'
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
  },


  content1: {
    flex: 1,
    padding: 20,
  },
  title1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

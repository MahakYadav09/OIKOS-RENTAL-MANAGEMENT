import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FavouriteHotelCard from '@/components/cards/favouriteHotelCard'
import { UserContext } from '@/context/guest/UserContext'

const favourite = () => {

  const { profile } = useContext(UserContext)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'white' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourite Places</Text>

        <TouchableOpacity style={styles.clearBtn} >
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {
        profile?.favorites?.map((item: any) => (
          <FavouriteHotelCard key={item} hotelId={item}/>
        ))
      }
      {/* <FavouriteHotelCard/> */}
    </SafeAreaView>
  )
}

export default favourite

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 5,
    height:60,
    marginTop:10,
    borderBottomWidth:1,
    paddingBottom:10,
    borderColor:'rgba(0,0,0,.06)'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  clearBtn: {
    backgroundColor: '#e1e1e1ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius:30
  },
  heart: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 50,
  },
  content: {
    // padding: 14,
    marginTop:10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteBtn: {
    backgroundColor: '#e1e1e1ff',
    marginTop: 12,
    paddingVertical:14,
    borderRadius: 12,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 16,
    fontWeight:500,
    color: '#444',
  },
})
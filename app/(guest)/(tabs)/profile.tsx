import { UserContext } from '@/context/guest/UserContext';
import { UpdateUserRole } from '@/hooks/switchRole';
import { handleSignOut } from '@/hooks/useSignOut';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  FileText,
  Hand,
  HelpCircle,
  LogOut,
  Route,
  User,
  UserPlus,
  Users
} from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function MenuItem({ icon, title, dot, danger, route }: { icon: React.ReactNode; title: string; dot?: boolean; danger?: boolean, route: any }) {

  const router = useRouter();

  return (
    <TouchableOpacity style={styles.item} onPress={() => router.push(route)}>
      <View style={styles.left}>
        {icon}
        {dot && <View style={styles.dot} />}
      </View>

      <Text style={[styles.text, danger && styles.dangerText]}>
        {title}
      </Text>

      <ChevronRight size={20} color="#999" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {

  const router = useRouter();
  const [user, setUser] = useState([])
  const [userId, setUserId] = useState([])

  const signOut = () => {
    handleSignOut(setUser, router);
  }
  const { profile } = useContext(UserContext);
  console.log(profile)

  const fetch = async () => {
    const log = await AsyncStorage.getAllKeys()
    console.log('profile', log)
  }
  fetch();
  useEffect(() => {
  }, [router])
  fetch();

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} >

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: `${profile?.profile_image_url}`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.role}>{profile?.role}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsRow}>
          <OptionCard
            title="Past trips"
            image="https://i.pinimg.com/736x/7f/f2/aa/7ff2aa45298ceab2c08dbc5cee1e7d4e.jpg"
          />
          <OptionCard
            title="Connections"
            image="https://i.pinimg.com/736x/3e/af/6a/3eaf6aa1a670dc3049e18fac91422e49.jpg"
          // isNew
          />
        </View>

        {/* Become Host */}
        <View style={styles.hostCard}>
          <Image
            source={{
              uri: 'https://i.pinimg.com/736x/bd/57/dd/bd57dd2c575aa8566b697bc68673d630.jpg',
            }}
            style={styles.hostImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.hostTitle}>Become a host</Text>
            <Text style={styles.hostDesc}>
              It’s easy to start hosting and earn extra income.
            </Text>
          </View>
        </View>

        {/* Top Section */}
        <View style={styles.section}>
          <MenuItem
            route='/(guest)/detail/personalDetail'
            icon={<User size={22} color="#000" />}
            title="Personal Info"
            dot
          />
          <MenuItem
            route='/(guest)/detail/text'
            icon={<HelpCircle size={22} color="#000" />}
            title="Get help"
          />
          <MenuItem
            route=''
            icon={<User size={22} color="#000" />}
            title="View profile"
          />
          <MenuItem
            route=''
            icon={<Hand size={22} color="#000" />}
            title="Privacy"
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Section */}
        <View style={styles.section}>
          <MenuItem
            route=''
            icon={<Users size={22} color="#000" />}
            title="Refer a host"
          />
          <MenuItem
            route=''
            icon={<UserPlus size={22} color="#000" />}
            title="Find a co-host"
          />
          <MenuItem
            route=''
            icon={<FileText size={22} color="#000" />}
            title="Legal"
          />
          {/* <MenuItem
            route=''
            icon={<LogOut size={22} color="#000" />}
            title="Log out"
            danger
          /> */}
          <TouchableOpacity style={styles.item} onPress={signOut}>
            <View style={styles.left}>
              <LogOut size={22} color="#000" />
              {/* {dot && <View style={styles.dot} />} */}
            </View>

            <Text style={[styles.text, styles.dangerText]}>
              Log Out
            </Text>

            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
          <View style={{ paddingVertical: 40 }}></View>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.switchBtn} onPress={() => {
        UpdateUserRole(profile?.uid, 'host')
        router.push('/switch?to=host')
      }}>
        <Route size={20} color={'white'} />
        <Text style={{ fontSize: 16, fontWeight: 500, color: 'white' }}>Switch To Host</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Option Card ---------------- */

function OptionCard({ title, image, isNew }: { title: string; image: string; isNew?: boolean }) {
  return (
    <View style={styles.optionCard}>
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
      <Image source={{ uri: image }} style={styles.optionImage} />
      <Text style={styles.optionTitle}>{title}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    // marginTop: 60,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
  },
  bell: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 50,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
    borderColor: 'rgba(0,0,0,.06)',
    borderWidth: 1
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textTransform: 'capitalize',
    width: '100%',
    textAlign: 'center'
  },
  role: {
    textAlign: 'center',
    width: '100%',
    textTransform: 'capitalize',
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  /* Options */
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 20,
    borderColor: 'rgba(0,0,0,.06)',
    borderWidth: 1
  },
  optionImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2E4FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  /* Host Card */
  hostCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 30,
    borderColor: 'rgba(0,0,0,.06)',
    borderWidth: 1
  },
  hostImage: {
    width: 60,
    height: 60,
    marginRight: 14,
  },
  hostTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  hostDesc: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  section: {

  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },

  left: {
    width: 32,
    alignItems: 'center',
    marginRight: 14,
  },

  text: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  dangerText: {
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },

  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF385C',
  },
  switchBtn: {
    paddingHorizontal: 30,
    borderRadius: 30,
    paddingVertical: 12,
    backgroundColor: '#323232ff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: '2%',
    left: '50%',
    transform: "translate(-40%,0)",
    flexDirection: 'row'
  }
});

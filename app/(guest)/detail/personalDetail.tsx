import { db } from '@/app/firebase/firebase.config';
import { UserContext } from '@/context/guest/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SectionType = 'NONE' | 'NAME' | 'PHONE' | 'EMAIL' | 'DETAIL' | 'HOUSE' | 'CITY' | 'PINCODE';

export default function PersonalInfo() {
  const router = useRouter();
  const { profile, setProfile } = useContext(UserContext);

  const [activeSection, setActiveSection] = useState<SectionType>('NONE');

  const [name, setName] = useState(profile?.name || '');
  const [email,setEmail] = useState(profile?.email || '')
  const [phone, setPhone] = useState(profile?.phone || '');
  const [house, setHouse] = useState(profile?.house || '');
  const [city, setCity] = useState(profile?.city || '');
  const [pincode, setPincode] = useState(profile?.pinCode || '');

  const [loading, setLoading] = useState(false);

  const cancelEdit = () => {
    setName(profile?.name || '');
    setPhone(profile?.phone || '');
    setHouse(profile?.house || '');
    setCity(profile?.city || '');
    setPincode(profile?.pinCode || '');
    setActiveSection('NONE');
  };

  const saveField = async (key: string, value: string) => {
    if (!profile) {
      Alert.alert('Error', 'No profile found');
      return;
    }
    if (!value) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const updated = { ...profile, [key]: value };
      await updateDoc(doc(db, 'users', profile.uid), { [key]: value });
      setProfile(updated);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
      setActiveSection('NONE');
    } catch {
      Alert.alert('Error', 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const saveName = () => saveField('name', name);
  const savePhone = () => saveField('phone', phone);
  const saveHouse = () => saveField('house', house);
  const saveCity = () => saveField('city', city);
  const savePincode = () => saveField('pincode', pincode);
  const saveEmail = () => saveField('email', email);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Personal info</Text>

      {/* ========== LEGAL NAME ========== */}
      {activeSection === 'NAME' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Legal name</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name on ID"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveName}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>Legal name</Text>
            <Text style={styles.infoSub}>{profile?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('NAME')}>
            <Text style={styles.action}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========== PHONE ========== */}
      {activeSection === 'PHONE' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Phone number</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={savePhone}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>Phone number</Text>
            <Text style={styles.infoSub}>
              {profile?.phone || 'Not provided'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('PHONE')}>
            <Text style={styles.action}>
              {profile?.phone ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      )}


      {/* ========== HOUSE ========== */}
      {activeSection === 'HOUSE' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>House</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={house}
            onChangeText={setHouse}
            placeholder="House / Building"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveHouse}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>House</Text>
            <Text style={styles.infoSub}>{profile?.house || 'Not provided'}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('HOUSE')}>
            <Text style={styles.action}>
              {profile?.house ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========== CITY ========== */}
      {activeSection === 'CITY' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>City</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveCity}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>City</Text>
            <Text style={styles.infoSub}>{profile?.city || 'Not provided'}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('CITY')}>
            <Text style={styles.action}>
              {profile?.city ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========== PINCODE ========== */}
      {activeSection === 'PINCODE' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Pincode</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            placeholder="Pincode"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={savePincode}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>Pincode</Text>
            <Text style={styles.infoSub}>{profile?.pinCode || 'Not provided'}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('PINCODE')}>
            <Text style={styles.action}>
              {profile?.pinCode ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========== EMAIL ========== */}
      {activeSection === 'EMAIL' ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setPincode}
            placeholder="Email"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveEmail}
            disabled={loading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoTitle}>Email</Text>
            <Text style={styles.infoSub}>{profile?.email || 'Not provided'}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveSection('EMAIL')}>
            <Text style={styles.action}>
              {profile?.email ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop:30
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    width: 260,
  },
  cancel: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
    marginBottom: 30,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoSub: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
  action: {
    color: '#bbb',
    fontSize: 14,
  },
});


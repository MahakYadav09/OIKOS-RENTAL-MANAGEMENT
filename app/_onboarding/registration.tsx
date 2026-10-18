import Loader from '@/components/loader/loader';
import { UserContext } from '@/context/guest/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ChevronLeft } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, storage } from '../firebase/firebase.config';

const OwnerRegistrationForm = () => {

  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { loadUser } = useContext(UserContext);

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    house: '',
    city: '',
    pinCode: '',
    idProofType: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // 1️⃣ Create Auth User
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = res.user.uid;

      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();

        const imageRef = ref(storage, `User-profile-image/${uid}.jpg`);
        await uploadBytes(imageRef, blob);

        imageUrl = await getDownloadURL(imageRef);
      }

      const userRole = role || 'guest';

      // 2️⃣ Save user profile in Firestore
      await setDoc(doc(db, 'users', uid), {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        dob: form.dob,
        house: form.house,
        city: form.city,
        pinCode: form.pinCode,
        profile_image_url: imageUrl,
        role: userRole,
        createdAt: serverTimestamp(),
      })
        .then(async () => {
          setLoading(false);
          Alert.alert('Welcome To Oikos')
          await AsyncStorage.setItem('loggedIn', 'true');
          await AsyncStorage.setItem('uid', uid);

          // IMPORTANT: Load user data into context immediately
          await loadUser();

          if (userRole === 'host') {
            router.push('/(host)/(tabs)');
          } else {
            router.push('/(guest)/(tabs)');
          }
        })

      // 3️⃣ Redirect
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} title={''} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/_onboarding/option')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Details</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Date Of Birth"
            placeholderTextColor="#9CA3AF"
            value={form.dob}
            onChangeText={(value) => handleChange('dob', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="House / Street / Landmark"
            placeholderTextColor="#9CA3AF"
            value={form.house}
            onChangeText={(value) => handleChange('house', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={form.city}
            onChangeText={(value) => handleChange('city', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Pin Code"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={form.pinCode}
            onChangeText={(value) => handleChange('pinCode', value)}
          />


          <Text>Select Profile Picture</Text>
          <TouchableOpacity
            style={styles.uploadContainer}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconText}>+</Text>
            </View>
            <Text style={styles.uploadText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={{ width: '100%', aspectRatio: 1.6 / 1, borderRadius: 10 }} />}

        </View>

        {/* Next Step Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backIcon: {
    fontSize: 32,
    color: '#1F2937',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formContainer: {
    gap: 15,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  uploadContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIconText: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  uploadText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dropdownButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 15,
    color: '#1F2937',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
  },
  checkmark: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: 'bold',
  },
});

export default OwnerRegistrationForm;
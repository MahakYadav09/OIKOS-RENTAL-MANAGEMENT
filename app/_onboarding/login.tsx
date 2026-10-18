import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/context/guest/UserContext';
import Loader from '@/components/loader/loader';


const LoginScreen = () => {

  const router = useRouter();
  const [email,setEmail] = useState<string>('');
  const [password,setPassword] = useState<string>('');

  const [loading,setLoading] = useState(false);
  const { loadUser } = useContext(UserContext)

  const handleLogin = async () => {
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  setLoading(true)

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 🔥 SUCCESS
    const uid = userCredential.user.uid;
    await AsyncStorage.setItem('uid', uid);
    await AsyncStorage.setItem('loggedIn', 'true');
    loadUser();
    router.push("/(guest)/(tabs)")

  } catch (e: any) {
    setLoading(false)
    let message = 'Something went wrong';

    if (e.code === 'auth/user-not-found') {
      message = 'User not found';
    } else if (e.code === 'auth/wrong-password') {
      message = 'Incorrect password';
    } else if (e.code === 'auth/invalid-email') {
      message = 'Invalid email';
    }

    alert(message);
  }
  setLoading(false)
};

useEffect(()=>{
  const fetch = async () =>{
    const log = await AsyncStorage.getAllKeys()
    console.log('login page',log)
  }
  fetch();
},[router])

  return (
    <View style={styles.container}>
      <Loader visible={loading} title={'Welcome To Oikos'}/>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/_onboarding/onboarding')}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoBox}>
          <Text style={styles.logoText}>OiKos</Text>
        </View>
        <View style={{ width: 20 }}></View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>

      {/* Inputs */}
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType='email-address'
          onChangeText={(e)=>setEmail(e)}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          onChangeText={(e)=>setPassword(e)}
        />

        <TouchableOpacity style={styles.forgotContainer} onPress={() => router.push('/_onboarding/forgetPassword')}>
          <Text style={styles.forgotText}>Forget Password ?</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.googleBtn}>
          <Text style={styles.googleText}>Sign Up With Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: '95%',
    marginTop: 20
  },

  logoBox: {
    borderWidth: 1.5,
    borderColor: '#FF3B3B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  logoText: {
    color: '#FF3B3B',
    fontWeight: '700',
    fontSize: 18,
  },

  title: {
    marginTop: 80,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  form: {
    marginTop: 40,
  },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
  },

  forgotContainer: {
    alignItems: 'flex-end',
  },

  forgotText: {
    color: '#FF3B3B',
    fontSize: 13,
    fontWeight: '500',
  },

  bottom: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },

  googleBtn: {
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  googleText: {
    fontSize: 15,
    fontWeight: '500',
  },

  loginBtn: {
    backgroundColor: '#FF3B3B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

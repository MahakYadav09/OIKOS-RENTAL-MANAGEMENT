import { db } from '@/app/firebase/firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';

type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  role: string;
  house?: string;
  city?: string;
  pinCode?: string;
  profile_image_url?: string;
  favorites: any[];

};

type UserContextType = {
  user: string | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (uid: string | null) => void;
  setProfile: (data: UserProfile | null) => void;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateFavoriteData: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  setUser: () => { },
  setProfile: () => { },
  logout: async () => { },
  loadUser: async () => { },
  updateFavoriteData: async () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 App start pe sirf 1 baar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('fetching user data')
      const uid = await AsyncStorage.getItem('uid');
      const cachedProfile = await AsyncStorage.getItem('userProfile');

      if (!uid) {
        setLoading(false);
        return;
      }

      setUser(uid);

      // ✅ Agar local data hai → Firestore hit nahi
      // CHECK: Ensure cached data matches the current user!
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        if (parsedProfile.uid === uid) {
          console.log("user data found in cache and matches uid");
          setProfile(parsedProfile);
          setLoading(false);
          return;
        } else {
          console.log("cached data exists but uid mismatch - fetching fresh data");
        }
      }


      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = { uid, ...snap.data() } as UserProfile;
        console.log('user data: ', data.favorites)
        setProfile(data);
        await AsyncStorage.setItem('userProfile', JSON.stringify(data));
      }

      setLoading(false);
    } catch (err) {
      console.log('User load error', err);
      setLoading(false);
    }
  };

  const updateFavoriteData = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');

      if (!uid) return;

      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = { uid, ...snap.data() } as UserProfile;
        console.log('user data: ', data.favorites)
        setProfile(data);
        await AsyncStorage.setItem('userProfile', JSON.stringify(data));
        console.log("cache updated")
      }

    } catch (error) {
      console.log('User load error', error);
    }
  }


  const logout = async () => {
    await AsyncStorage.multiRemove(['uid', 'userProfile', 'loggedIn']);
    setUser(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        setUser,
        setProfile,
        logout,
        updateFavoriteData,
        loadUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

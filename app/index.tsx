import { UserContext } from '@/context/guest/UserContext';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const index = () => {
  const { profile, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      // Not logged in
      router.replace('/_onboarding/onboarding');
    } else if (profile.role === 'host') {
      router.replace('/(host)/(tabs)');
    } else if(profile.role=== 'guest'){
      router.replace('/(guest)/(tabs)');
    }
  }, [profile, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  )
}

export default index
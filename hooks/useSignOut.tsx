import { auth } from "@/app/firebase/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { Alert } from "react-native";

export const handleSignOut = async (
  setUser: any,
  router: any
) => {
  try {
    await signOut(auth);

    await AsyncStorage.multiRemove([
      'uid',
      'userProfile',
      'loggedIn',
    ]);

    setUser(null);

    router.replace('/_onboarding/login');
  } catch (error) {
    Alert.alert('Error', 'Sign out failed');
  }
};
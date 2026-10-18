import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,  Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {

    const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
           <Image source={require("../../assets/images/welcome-logo.png")} style={{width:145,height:90}} />
          </View>
        </View>

        {/* Welcome Button */}
        <TouchableOpacity 
          style={styles.welcomeButton}
          onPress={() => router.push('/_onboarding/onboarding')}
          activeOpacity={0.8}
        >
          <Text style={styles.welcomeButtonText}>Welcome</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    // paddingBottom: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  logoHouse: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
    marginBottom: -2,
    zIndex: 1,
  },
  logoBox: {
    borderWidth: 3,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 1,
  },
  welcomeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '90%',
    // maxWidth: 320,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen;
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {

    const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBorder}>
            <Text style={styles.logoText}>OiKos</Text>
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineText}>
            Companion of{'\n'}Your, <Text style={styles.taglineHighlight}>Perfect{'\n'}Trip.</Text>
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push("/_onboarding/login")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/_onboarding/option')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBorder: {
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  taglineContainer: {
    marginBottom: 40,
  },
  taglineText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 40,
  },
  taglineHighlight: {
    color: '#EF4444',
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Onboarding;
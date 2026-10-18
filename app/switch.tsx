import { UserContext } from '@/context/guest/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function IntroVideoScreen() {

  const router = useRouter();
  const navigation = useNavigation();
  const { to } = useLocalSearchParams<{ to: 'host' | 'traveller' }>();

  // Default to host if not specified or invalid
  const target = to === 'traveller' ? 'traveller' : 'host';
  const isTargetHost = target === 'host';
  const displayText = isTargetHost ? "Switching... To Host" : "Switching... To Traveller";
  const nextRoute = isTargetHost ? "/(host)/(tabs)" : "/(guest)/(tabs)";

  const player = useVideoPlayer(
    require('../assets/video/switchUserToHost.mp4'), // local video
    (player) => {
      player.loop = false;
      player.play();
      player.volume = 0;
    }
  );

  useFocusEffect(
    useCallback(() => {
      // ▶️ Screen focus → play
      player.play();

      return () => {
        // ⏸ Screen blur → pause
        player.pause();
      };
    }, [player])
  );



  const { loadUser } = useContext(UserContext);

  useEffect(() => {
    const performSwitch = async () => {
      // Small delay for video
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh user profile to get new role
      await loadUser();

      // Navigate
      router.replace(nextRoute);
    };

    performSwitch();
  }, [nextRoute])


  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
      />
      <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 15 }}>{displayText} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  video: {
    // flex: 1,
    width: '90%',
    height: 180,
    borderRadius: 10,
  },
});

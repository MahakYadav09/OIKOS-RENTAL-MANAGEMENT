import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2 } from "lucide-react-native";

export default function ListingSuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <CheckCircle2 size={72} strokeWidth={1.8} color="#000" />
      </View>

      <Text style={styles.title}>Your listing is complete!</Text>

      <Text style={styles.subtitle}>
        Great job — your place is ready to welcome guests. You can manage
        bookings, pricing, and details anytime.
      </Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 120,
    alignItems: "center",
  },

  iconWrapper: {
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
});

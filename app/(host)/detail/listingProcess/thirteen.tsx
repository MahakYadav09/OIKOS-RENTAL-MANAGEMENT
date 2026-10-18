import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CalendarCheck, Zap } from "lucide-react-native";
import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";

export default function BookingSettingsScreen() {

  const [selected, setSelected] = useState("approve_first");
  const { bookingReq , setBookingReq } = useContext(PropertyOnboardingContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick your booking settings</Text>

      <Text style={styles.subtitle}>
        You can change this at any time.{" "}
        <Text style={styles.link}>Learn more</Text>
      </Text>

      {/* APPROVE FIRST 5 BOOKINGS */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelected("approve_first")
          setBookingReq('approve_first')
        }}
        style={[
          styles.card,
          bookingReq === "approve_first" && styles.cardSelected,
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>
              Review reservation than Approve
            </Text>
            <Text style={styles.recommended}>Recommended</Text>
            <Text style={styles.cardDescription}>
              Start by reviewing reservation requests, then switch to Instant
              Book so guests can book automatically.
            </Text>
          </View>

          <CalendarCheck size={28} strokeWidth={1.8} />
        </View>
      </TouchableOpacity>

      {/* INSTANT BOOK */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
           setSelected("instant_book")
          setBookingReq('instant_book')
        }}
        style={[
          styles.card,
          bookingReq === "instant_book" && styles.cardSelected,
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>Use Instant Book</Text>
            <Text style={styles.cardDescription}>
              Let guests book automatically.
            </Text>
          </View>

          <Zap size={28} strokeWidth={1.8} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 28,
  },

  link: {
    textDecorationLine: "underline",
    color: "#000",
  },

  card: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    backgroundColor: "#FFF",
  },

  cardSelected: {
    borderColor: "#000",
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  textBlock: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },

  recommended: {
    color: "#1F7A1F",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 15,
    color: "#6B6B6B",
    lineHeight: 20,
  },
});

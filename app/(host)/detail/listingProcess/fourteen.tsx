import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Pencil } from "lucide-react-native";
import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";

const SERVICE_FEE_RATE = 0.14; // ~14% guest service fee
const HOST_FEE_RATE = 0.03; // ~3% host fee

export default function WeekdayPriceScreen() {
  const [priceText, setPriceText] = useState(1612);
  const [editing, setEditing] = useState(false);
  const { price, setPrice } = useContext(PropertyOnboardingContext)

  const guestServiceFee = Math.round(price * SERVICE_FEE_RATE);
  const guestPriceBeforeTax = price + guestServiceFee;
  const hostFee = Math.round(price * HOST_FEE_RATE);
  const youEarn = price - hostFee;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Now, set a weekday base price</Text>

        <Text style={styles.subtitle}>
          Tip: ₹1,612. You’ll set a weekend price next.
        </Text>

        {/* PRICE DISPLAY */}
        <View style={styles.priceRow}>
          {editing ? (
            <TextInput
              value={String(price)}
              onChangeText={(val) => setPrice(Number(val) || 0)}
              keyboardType="numeric"
              autoFocus
              style={styles.priceInput}
            />
          ) : (
            <Text style={styles.price}>₹{price.toLocaleString("en-IN")}</Text>
          )}

          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Pencil size={18} />
          </TouchableOpacity>
        </View>

        {/* PRICE BREAKDOWN */}
        <View style={styles.breakdownCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Base price</Text>
            <Text style={styles.rowValue}>₹{price.toLocaleString("en-IN")}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Guest service fee</Text>
            <Text style={styles.rowValue}>
              ₹{guestServiceFee.toLocaleString("en-IN")}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.rowLabel, styles.bold]}>
              Guest price before taxes
            </Text>
            <Text style={[styles.rowValue, styles.bold]}>
              ₹{guestPriceBeforeTax.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* YOU EARN */}
        <View style={styles.earnCard}>
          <Text style={styles.rowLabel}>You earn</Text>
          <Text style={styles.earnValue}>
            ₹{youEarn.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* <Text style={styles.showLess}>Show less</Text> */}
      </View>
    </TouchableWithoutFeedback>
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
    marginBottom: 8,
    color: "#000",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 30,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 28,
  },

  price: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
  },

  priceInput: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
    borderBottomWidth: 1,
    borderColor: "#000",
    minWidth: 140,
    textAlign: "center",
  },

  breakdownCard: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  earnCard: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  rowLabel: {
    fontSize: 16,
    color: "#000",
  },

  rowValue: {
    fontSize: 16,
    color: "#000",
  },

  bold: {
    fontWeight: "600",
  },

  earnValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 10,
  },

  showLess: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
  },
});

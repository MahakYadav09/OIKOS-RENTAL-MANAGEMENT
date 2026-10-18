import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CounterRowProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const CounterRow = ({ label, value, onDecrease, onIncrease }: CounterRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.counter}>
        <TouchableOpacity
          style={[styles.circleButton, value === 0 && styles.disabled]}
          onPress={onDecrease}
          disabled={value === 0}
        >
          <Text style={styles.circleText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.value}>{value}</Text>

        <TouchableOpacity style={styles.circleButton} onPress={onIncrease}>
          <Text style={styles.circleText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PersonsList() {
  const { basicData, setBasicData } = useContext(PropertyOnboardingContext);

  const updateField = (key: string, value: number) => {
    setBasicData({
      ...basicData,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share some basics about your place</Text>
      <Text style={styles.subtitle}>
        You'll add more details later, such as bed types.
      </Text>

      <CounterRow
        label="Guests"
        value={basicData.guest}
        onDecrease={() => updateField("guest", Math.max(0, basicData.guest - 1))}
        onIncrease={() => updateField("guest", basicData.guest + 1)}
      />

      <CounterRow
        label="Bedrooms"
        value={basicData.bedrooms}
        onDecrease={() =>
          updateField("bedrooms", Math.max(0, basicData.bedrooms - 1))
        }
        onIncrease={() => updateField("bedrooms", basicData.bedrooms + 1)}
      />

      <CounterRow
        label="Beds"
        value={basicData.beds}
        onDecrease={() =>
          updateField("beds", Math.max(0, basicData.beds - 1))
        }
        onIncrease={() => updateField("beds", basicData.beds + 1)}
      />

      <CounterRow
        label="Bathrooms"
        value={basicData.bathrooms}
        onDecrease={() =>
          updateField("bathrooms", Math.max(0, basicData.bathrooms - 1))
        }
        onIncrease={() => updateField("bathrooms", basicData.bathrooms + 1)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  label: {
    fontSize: 18,
    color: "#000",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.3,
  },
  circleText: {
    fontSize: 20,
    color: "#000",
  },
  value: {
    fontSize: 18,
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
});

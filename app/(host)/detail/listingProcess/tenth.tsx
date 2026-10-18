import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Leaf,
  Sparkles,
  Users,
  Palette,
  MapPin,
  Maximize,
} from "lucide-react-native";
import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";

const HIGHLIGHTS = [
  { id: "peaceful", label: "Peaceful", icon: Leaf },
  { id: "unique", label: "Unique", icon: Sparkles },
  { id: "family", label: "Family-friendly", icon: Users },
  { id: "stylish", label: "Stylish", icon: Palette },
  { id: "central", label: "Central", icon: MapPin },
  { id: "spacious", label: "Spacious", icon: Maximize },
];

export default function HighlightsScreen() {

  const [selected, setSelected] = useState<any>([]);

  const {speciality,setSpeciality} = useContext(PropertyOnboardingContext);

  const toggleHighlight = (id:any) => {
    setSelected((prev:any) => {
      if (prev.includes(id)) {
        return prev.filter((item:any) => item !== id);
      }
      if (prev.length === 2) return prev; // max 2
      return [...prev, id];
    });
    setSpeciality(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next, let's describe your house</Text>

      <Text style={styles.subtitle}>
        Choose up to 2 highlights. We'll use these to get your description
        started.
      </Text>

      <View style={styles.pillsContainer}>
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          const isSelected = speciality.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleHighlight(item.id)}
              activeOpacity={0.85}
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
              ]}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                color="#000"
              />
              <Text style={styles.pillText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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

  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#CFCFCF",
    backgroundColor: "#FFF",
  },

  pillSelected: {
    borderColor: "#000",
  },

  pillText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

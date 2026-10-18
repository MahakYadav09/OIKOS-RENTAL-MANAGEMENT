import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Home,
  DoorOpen,
  Users,
} from "lucide-react-native";
import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";

type Option = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const OPTIONS: Option[] = [
  {
    id: "entire_place",
    title: "An entire place",
    description: "Guests have the whole place to themselves.",
    icon: <Home size={26} />,
  },
  {
    id: "private_room",
    title: "A room",
    description:
      "Guests have their own room in a home, plus access to shared spaces.",
    icon: <DoorOpen size={26} />,
  },
  {
    id: "shared_room",
    title: "A shared room in a hostel",
    description:
      "Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.",
    icon: <Users size={26} />,
  },
];

const GuestPlaceTypeStep = () => {
  const [selected, setSelected] = useState("entire_place");

  const { setHousePart, housePart } = useContext(PropertyOnboardingContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        What type of place will guests have?
      </Text>

      {OPTIONS.map((item) => {
        const active = housePart === item.title;

        return (
          <Pressable
            key={item.id}
            onPress={() => {
              setSelected(item.id)
              setHousePart(item.title)
            }}
            style={[
              styles.card,
              active && styles.activeCard,
            ]}
          >
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>

            <View style={styles.icon}>{item.icon}</View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default GuestPlaceTypeStep;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    color: "#000",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  activeCard: {
    borderColor: "#000",
    borderWidth: 2,
  },

  textContainer: {
    flex: 1,
    paddingRight: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },

  cardDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  icon: {
    marginLeft: 10,
  },
});

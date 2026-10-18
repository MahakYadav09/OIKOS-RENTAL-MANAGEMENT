import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import {
  Home,
  Building2,
  Warehouse,
  Coffee,
  Sailboat,
  HomeIcon,
  Caravan,
  Landmark,
  Tent,
  Castle,
  Hotel,
  Trees,
} from "lucide-react-native";
import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";

type PlaceOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const PLACE_OPTIONS: PlaceOption[] = [
  { id: "house", label: "House", icon: <Home size={28} /> },
  { id: "apartment", label: "Flat / apartment", icon: <Building2 size={28} /> },
  { id: "barn", label: "Barn", icon: <Warehouse size={28} /> },
  { id: "bnb", label: "Bed & breakfast", icon: <Coffee size={28} /> },
  { id: "boat", label: "Boat", icon: <Sailboat size={28} /> },
  { id: "cabin", label: "Cabin", icon: <HomeIcon size={28} /> },
  { id: "campervan", label: "Campervan / motorhome", icon: <Caravan size={28} /> },
  { id: "casa", label: "Casa particular", icon: <Landmark size={28} /> },
  { id: "tent", label: "Tent", icon: <Tent size={28} /> },
  { id: "castle", label: "Castle", icon: <Castle size={28} /> },
  { id: "hotel", label: "Hotel", icon: <Hotel size={28} /> },
  { id: "farm", label: "Farm stay", icon: <Trees size={28} /> },
];

const PlaceTypeStep = () => {

  const { setHouseType, houseType } = useContext(PropertyOnboardingContext);
  const [selected, setSelected] = useState<string | null>("house");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Which of these best describes your place?
      </Text>

      <FlatList
        data={PLACE_OPTIONS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isActive = houseType === item.id;

          return (
            <Pressable
              onPress={() => {
                setSelected(item.id)
                setHouseType(item.id)
              }}
              style={[
                styles.card,
                isActive && styles.activeCard,
              ]}
            >
              <View style={styles.icon}>{item.icon}</View>
              <Text style={styles.label}>{item.label}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default PlaceTypeStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#000",
  },

  list: {
    paddingBottom: 40,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },

  activeCard: {
    borderColor: "#000",
    borderWidth: 2,
  },

  icon: {
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

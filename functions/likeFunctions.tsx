import { db } from "@/app/firebase/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "firebase/auth";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

interface ToggleFavoriteParams {
  userId: string;
  propertyId: string;
  isFavorite: boolean;
  updateFavoriteData: () => Promise<void>;
}


export const toggleFavorite = async ({
  userId,
  propertyId,
  isFavorite,
  updateFavoriteData,
}: ToggleFavoriteParams) => {

  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      favorites: isFavorite
        ? arrayRemove(propertyId)
        : arrayUnion(propertyId),
    });

    await updateFavoriteData();

    return {
      success: true,
      action: isFavorite ? "removed" : "added",
    };
  } catch (error) {
    { }
    console.error("toggleFavorite error:", error);
    return {
      success: false,
      error,
    };
  }
};


// check is like already or not 

interface CheckFavoriteParams {
  userId: string;      // current user uid
  propertyId: string; // hotel / property docId
}

export const checkIsFavorite = async ({
  userId,
  propertyId,
}: CheckFavoriteParams) => {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return {
        success: false,
        isFavorite: false,
        error: "User not found",
      };
    }

    const data = snap.data();
    const favorites: string[] = data.favorites || [];

    const isFavorite = favorites.includes(propertyId);

    return {
      success: true,
      isFavorite,
    };
  } catch (error) {
    console.error("checkIsFavorite error:", error);
    return {
      success: false,
      isFavorite: false,
      error,
    };
  }
};
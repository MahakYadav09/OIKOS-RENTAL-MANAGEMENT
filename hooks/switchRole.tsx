import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UpdateUserRole = async (userId:any, newRole:string) => {
  try {
    console.log(userId,newRole)
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date(), // optional but recommended
    });

    const storedUser = await AsyncStorage.getItem("userProfile");
    if (!storedUser) {
      console.log("user not found");
      return false;
    }

    const userObj = JSON.parse(storedUser);

     const updatedUser = {
      ...userObj,
      role: newRole,
    };

    await AsyncStorage.setItem("userProfile", JSON.stringify(updatedUser));

    console.log("✅ User role updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    return false;
  }
};

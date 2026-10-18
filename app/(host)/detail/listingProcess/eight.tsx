import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";
import * as ImagePicker from "expo-image-picker";
import { Camera, Plus, Trash2 } from "lucide-react-native";
import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase/firebase.config";

export default function PhotoUploadScreen() {
  const { photos, setPhotos } = useContext<any>(PropertyOnboardingContext);
  const [uploading, setUploading] = useState(false);

  /* ---------- UPLOAD IMAGE TO FIREBASE ---------- */
  const uploadImageToStorage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `property/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.jpg`;

    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  /* ---------- PICK + UPLOAD IMAGES ---------- */
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setUploading(true);

        const selectedUris = result.assets.map((a) => a.uri);

        const uploadedUrls = await Promise.all(
          selectedUris.map((uri) => uploadImageToStorage(uri))
        );

        setPhotos((prev: string[]) => [...prev, ...uploadedUrls]);
      } catch (err) {
        console.log("Upload error:", err);
      } finally {
        setUploading(false);
      }
    }
  };

  /* ---------- DELETE PHOTO ---------- */
  const deletePhoto = async (url: string) => {
    try {
      // 1️⃣ Firebase storage ref from download URL
      const imageRef = ref(storage, url);

      // 2️⃣ Delete from Firebase Storage
      await deleteObject(imageRef);

      // 3️⃣ Remove from context state
      setPhotos((prev: string[]) => prev.filter((p) => p !== url));

      console.log("Image deleted successfully");
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };

  /* ---------- FIRST UI (NO PHOTOS) ---------- */
  if (photos.length < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add some photos of your house</Text>
        <Text style={styles.subtitle}>
          You'll need 5 photos to get started. You can add more or make changes
          later.
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={pickImages}>
          <Plus size={22} />
          <Text style={styles.actionText}>Add photos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} disabled>
          <Camera size={22} />
          <Text style={styles.actionText}>Take new photos</Text>
        </TouchableOpacity>

        {uploading && <ActivityIndicator size="large" />}
      </View>
    );
  }

  /* ---------- SECOND UI (PHOTOS EXIST) ---------- */
  return (
    <View style={styles.container}>
      <View style={styles.rowHeader}>
        <View>
          <Text style={styles.titleSmall}>Choose at least 5 photos</Text>
          <Text style={styles.subtitleSmall}>Drag to reorder</Text>
        </View>

        <TouchableOpacity onPress={pickImages}>
          <Plus size={22} />
        </TouchableOpacity>
      </View>

      {uploading && <ActivityIndicator size="large" />}

      <FlatList
        data={photos}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />

            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverText}>Cover photo</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => deletePhoto(item)}
            >
              <Trash2 size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 30,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  actionText: {
    fontSize: 18,
    fontWeight: "500",
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleSmall: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitleSmall: {
    fontSize: 14,
    color: "#6B6B6B",
  },

  imageWrapper: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.1)",
    borderRadius: 20,
  },
  coverBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  coverText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 20,
  },
});

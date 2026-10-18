import { PropertyOnboardingContext } from "@/context/host/propertyOnboarding";
import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";

const MAX_LENGTH = 50;

export default function DescriptionScreen() {
  const { description ,setDescription } = useContext(PropertyOnboardingContext);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.title}>
        Create your description.
      </Text>

      <Text style={styles.subtitle}>
        Share what make you place special.
      </Text>

      {/* <View style={styles.inputWrapper}> */}
        <TextInput
          value={description}
          onChangeText={(e)=>setDescription(e)}
          maxLength={MAX_LENGTH}
          multiline
          placeholder="Enter your title"
          placeholderTextColor="#9A9A9A"
          style={styles.inputWrapper}
        />
      {/* </View> */}

      <Text style={styles.counter}>
        {description.length}/{MAX_LENGTH}
      </Text>
    </View>
    </TouchableWithoutFeedback>
  );
}

/* ---------------- STYLES ---------------- */

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
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginBottom: 28,
  },

  inputWrapper: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
  },

  input: {
    fontSize: 18,
    color: "#000",
    textAlignVertical: "top",
  },

  counter: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B6B6B",
  },
});

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const StepIntroThree = () => {
    return (
        <View style={styles.container}>

            {/* Image Placeholder */}
            <View style={styles.imagePlaceholder}>
              <Image source={{uri: "https://i.pinimg.com/1200x/94/42/0b/94420b8aa5f8d8f1ea59f4e2f4d6b913.jpg"}} style={{width:'100%',height:'100%',borderRadius:20}}/>
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
                <Text style={styles.stepText}>Step 3</Text>

                <Text style={styles.title}>
                    Finish up and Publish
                </Text>

                <Text style={styles.description}>
                  Finally you'll choose booking settings , set up pricing and publish yourlisting.
                </Text>
            </View>

        </View>
    );
};

export default StepIntroThree;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },

    imagePlaceholder: {
        height: 280,
        width: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: 16,
        marginTop: 20,
        marginBottom: 24,
    },

    textContainer: {
        width: "100%",
    },

    stepText: {
        fontSize: 14,
        color: "#717171",
        marginBottom: 8,
        fontWeight: "500",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        marginBottom: 16,
    },

    description: {
        fontSize: 16,
        color: "#484848",
        lineHeight: 24,
    },
});

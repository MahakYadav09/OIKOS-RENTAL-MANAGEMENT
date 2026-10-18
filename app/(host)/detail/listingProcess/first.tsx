import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const StepIntro = () => {
    return (
        <View style={styles.container}>

            {/* Image Placeholder */}
            <View style={styles.imagePlaceholder}>
              <Image source={{uri: "https://i.pinimg.com/1200x/b2/77/4a/b2774ade393c2612fbe949c7a7098930.jpg"}} style={{width:'100%',height:'100%',borderRadius:20}}/>
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
                <Text style={styles.stepText}>Step 1</Text>

                <Text style={styles.title}>
                    Tell us about your place
                </Text>

                <Text style={styles.description}>
                    In this step, we'll ask you which type of property you have and if
                    guests will book the entire place or just a room. Then let us know
                    the location and how many guests can stay.
                </Text>
            </View>

        </View>
    );
};

export default StepIntro;


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

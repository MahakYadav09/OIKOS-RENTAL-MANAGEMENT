import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderTitle } from '@react-navigation/elements';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const ForgetPasswordScreen = () => {

    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>router.push('/_onboarding/login')}>
                    <ChevronLeft size={24} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>Menu</Text>
                <View style={{ width: 20 }}></View>
            </View>
            {/* Title */}
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
                Enter your email address and we’ll send you a link to reset your password.
            </Text>

            {/* Input */}
            <View style={styles.form}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    style={styles.input}
                />
            </View>

            {/* Button */}
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.resetBtn}>
                    <Text style={styles.resetText}>Send Reset Link</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgetPasswordScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop:20
    },
    title: {
        marginTop: 80,
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
    },

    logoBox: {
        borderWidth: 1.5,
        borderColor: '#FF3B3B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },

    logoText: {
        color: '#FF3B3B',
        fontWeight: '700',
        fontSize: 16,
    },

    subtitle: {
        marginTop: 12,
        fontSize: 13,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },

    form: {
        marginTop: 40,
    },

    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 14,
    },

    bottom: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },

    resetBtn: {
        backgroundColor: '#FF3B3B',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },

    resetText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

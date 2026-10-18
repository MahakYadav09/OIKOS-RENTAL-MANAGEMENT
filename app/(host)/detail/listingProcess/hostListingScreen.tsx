import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import BottomNavigation from '@/components/progress/bottomNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@/components/progress/ProgressBar';
import StepIntro from './first';
import PlaceTypeStep from './second';
import GuestPlaceTypeStep from './third';
import ConfirmAddressStep from './fourth';
import PersonsList from './fifth';
import StepIntroTwo from './sixth';
import AmenitiesScreen from './seventh';
import PhotoUploadScreen from './eight';
import TitleScreen from './ninth';
import HighlightsScreen from './tenth';
import DescriptionScreen from './eleventh';
import StepIntroThree from './twelfth';
import BookingSettingsScreen from './thirteen';
import WeekdayPriceScreen from './fourteen';
import ListingSuccessScreen from './fifteen';
import { useRouter } from 'expo-router';
import { PropertyOnboardingContext } from '@/context/host/propertyOnboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS: any[] = [
    // StepPropertyType,
    // StepLocation,
    // StepPhotos,
];

const hostListingScreen = () => {

    const [step, setStep] = useState<any>(0);
    const [totalSteps, setTotalSteps] = useState<any>(15)
    const CurrentStep = STEPS[step];
    const router = useRouter();
    const { propertyData, saveDraft, loadDraft } = useContext(PropertyOnboardingContext);

    const resumestep = async() =>{
        const resumeStep = await loadDraft();
        console.log('resume step:',resumeStep)
        setStep(resumeStep);
        // setStep(resumeStep);
    }

    useEffect(()=>{
        resumestep();
    },[])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white' }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.saveBtn} onPress={() => {
                    console.log(propertyData)
                    saveDraft(step)
                    router.back()
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Save & exit</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                {
                    step === 0 ?
                        <StepIntro />
                        : ''
                }
                {
                    step === 1 ?
                        <PlaceTypeStep />
                        : ''
                }
                {
                    step === 2 ?
                        <GuestPlaceTypeStep />
                        : ''
                }
                {
                    step === 3 ?
                        <ConfirmAddressStep />
                        : ''
                }
                {
                    step === 4 ?
                        <PersonsList />
                        : ''
                }
                {
                    step === 5 ?
                        <StepIntroTwo />
                        : ''
                }
                {
                    step === 6 ?
                        <AmenitiesScreen />
                        : ''
                }
                {
                    step === 7 ?
                        <PhotoUploadScreen />
                        : ''
                }
                {
                    step === 8 ?
                        <TitleScreen />
                        : ''
                }
                {
                    step === 9 ?
                        <HighlightsScreen />
                        : ''
                }
                {
                    step === 10 ?
                        <DescriptionScreen />
                        : ''
                }
                {
                    step === 11 ?
                        <StepIntroThree />
                        : ''
                }
                {
                    step === 12 ?
                        <BookingSettingsScreen />
                        : ''
                }
                {
                    step === 13 ?
                        <WeekdayPriceScreen />
                        : ''
                }
                {
                    step === 14 ?
                        <ListingSuccessScreen />
                        : ''
                }
            </View>
            <View>
                <ProgressBar step={step} totalSteps={totalSteps} />
                <BottomNavigation setStep={setStep} step={step} />
            </View>
        </SafeAreaView>
    )
}

export default hostListingScreen

const styles = StyleSheet.create({
    header: {
        height: 60,
        // borderBottomWidth:1,
        paddingHorizontal: 18,
        justifyContent: 'center',
    },
    saveBtn: {
        width: 130,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.15)',
        borderRadius: 25,
        alignItems: 'center',
    }
})
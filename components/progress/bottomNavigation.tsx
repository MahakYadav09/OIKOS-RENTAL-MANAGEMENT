import React, { useContext, useState } from 'react'
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PropertyOnboardingContext } from '@/context/host/propertyOnboarding';
import Loader from '../loader/loader';

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: number;
}

export default function BottomNavigation({ setStep, step }: Props) {

  const next = () => {
    if (step <= 15) {
      setStep(step + 1)
    }
  }
  const back = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const router = useRouter();
  const { addPropertyToFirestore, clearDraft } = useContext(PropertyOnboardingContext);
  const [loading,setLoading] = useState(false);

  const handleAddProperty = () =>{
    setLoading(true);
    addPropertyToFirestore()
    .then(()=>{
      setLoading(false);
      router.push("/(host)/(tabs)/listing")
    })
  }

  return (
    <View style={styles.container} >

      <Loader visible={loading} title={"Adding Your Property..."}/>

      <TouchableOpacity onPress={back}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>

      {
        step === 14 ?
          <TouchableOpacity style={styles.nextBtn} onPress={handleAddProperty}>
            <Text style={styles.nextText}>Compete Listing</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    padding: 16,
    backgroundColor: 'white'
  },
  back: {
    fontSize: 16,
  },
  nextBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
});

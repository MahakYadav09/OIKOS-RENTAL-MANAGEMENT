import { db } from '@/app/firebase/firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext, useState } from 'react';
import { UserContext } from '../guest/UserContext';

const PROPERTY_DRAFT_KEY = 'PROPERTY_DRAFT_V1';

type PropertyOnboardingContextType = {
  loading: boolean;

  houseType: string;
  setHouseType: (value: string) => void;

  housePart: string;
  setHousePart: (value: string) => void;

  address: any;
  setAddress: (value: any) => void;

  basicData: {
    guest: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  setBasicData: (value: any) => void;

  amenities: any[];
  setAmenities: (value: any[]) => void;

  photos: any[];
  setPhotos: (value: any[]) => void;

  title: string;
  setTitle: (value: string) => void;

  speciality: any[];
  setSpeciality: (value: any[]) => void;

  description: string;
  setDescription: (value: string) => void;

  bookingReq: string;
  setBookingReq: (value: string) => void;

  price: number;
  setPrice: (value: number) => void;

  propertyData: any;

  draftChange: any;
  saveDraft: (step: number) => Promise<void>;
  loadDraft: () => Promise<number | null>;
  clearDraft: () => Promise<void>;
  addPropertyToFirestore: () => Promise<void>;
};

export const PropertyOnboardingContext =
  createContext<PropertyOnboardingContextType>(
    {} as PropertyOnboardingContextType
  );

export const PropertyOnboardingProvider = ({ children, }: { children: React.ReactNode; }) => {

  const { profile } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [houseType, setHouseType] = useState('house');
  const [housePart, setHousePart] = useState('An entire place');

  const [address, setAddress] = useState({
    country: '',
    flat: '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  });

  const [basicData, setBasicData] = useState({
    guest: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  });

  const [amenities, setAmenities] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [speciality, setSpeciality] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [bookingReq, setBookingReq] = useState('instant_book');
  const [price, setPrice] = useState(0);


  const [draftChange, setDraftChange] = useState<any>();

  // 💾 SAVE DRAFT
  const saveDraft = async (currentStep: number) => {
    const draft = {
      currentStep,
      data: {
        houseType,
        housePart,
        address,
        basicData,
        amenities,
        photos,
        title,
        speciality,
        description,
        bookingReq,
        price,
      },
      updatedAt: Date.now(),
    };

    await AsyncStorage.setItem(
      PROPERTY_DRAFT_KEY,
      JSON.stringify(draft)
    );
    setDraftChange(draft);
  };

  // 🔁 LOAD DRAFT


  const loadDraft = async (): Promise<number | null> => {
    const saved = await AsyncStorage.getItem(PROPERTY_DRAFT_KEY);
    if (!saved) return null;

    const draft = JSON.parse(saved);

    setHouseType(draft.data.houseType);
    setHousePart(draft.data.housePart);
    setAddress(draft.data.address);
    setBasicData(draft.data.basicData);
    setAmenities(draft.data.amenities || []);
    setPhotos(draft.data.photos || []);
    setTitle(draft.data.title || '');
    setSpeciality(draft.data.speciality || []);
    setDescription(draft.data.description || '');
    setBookingReq(draft.data.bookingReq || 'instant_book');
    setPrice(draft.data.price || 0);

    setDraftChange(draft);
    return draft.currentStep;
  };

  // 🧹 CLEAR DRAFT (AFTER FINAL SUBMIT)
  const clearDraft = async () => {
    await AsyncStorage.removeItem(PROPERTY_DRAFT_KEY);
    console.log('clear the local storage')
    setDraftChange({});
  };

  const propertyData = {
    house_type: houseType,
    house_part: housePart,
    property_address: address,
    guest_data: basicData,
    amenities,
    property_images: photos,
    property_title: title,
    speciality,
    property_description: description,
    booking_request: bookingReq,
    property_pricing: price,
  };

  const addPropertyToFirestore = async () => {
    try {

      // 🔹 Firestore payload
      const payload = {
        hostId: profile?.uid,
        hostPhone: profile?.phone,
        hostImage: profile?.profile_image_url,
        hostName: profile?.name,
        status: 'pending', // or "live"
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        houseType,
        housePart,
        address,
        basicData,
        amenities,
        photos,
        title,
        speciality,
        description,
        bookingReq,
        price,
      };

      // 🔹 Add to Firestore
      await addDoc(collection(db, 'properties'), payload)
        .then(() => {
          clearDraft();
        })

      // 🔹 Clear local draft after success
      await AsyncStorage.removeItem(PROPERTY_DRAFT_KEY);

    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  return (
    <PropertyOnboardingContext.Provider
      value={{
        loading,

        houseType,
        setHouseType,
        housePart,
        setHousePart,
        address,
        setAddress,
        basicData,
        setBasicData,
        amenities,
        setAmenities,
        photos,
        setPhotos,
        title,
        setTitle,
        speciality,
        setSpeciality,
        description,
        setDescription,
        bookingReq,
        setBookingReq,
        price,
        setPrice,

        propertyData,

        draftChange,
        saveDraft,
        loadDraft,
        clearDraft,
        addPropertyToFirestore,
      }}
    >
      {children}
    </PropertyOnboardingContext.Provider>
  );
};

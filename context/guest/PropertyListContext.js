import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";

const { createContext, useEffect, useState } = require("react");

export const PropertyListContext = createContext();

export const PropertyListContextProvider = ({ children }) => {

    const [properties, setProperties] = useState([]);
    // console.log("properties",properties)

    const fetchProperties = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "properties"));
            const propertiesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProperties(propertiesData);
            console.log("Realtime properties fetched:", propertiesData.length);
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(()=>{
        fetchProperties();
    },[]);

    return (
        <PropertyListContext.Provider value={{properties}}>
            {children}
        </PropertyListContext.Provider>
    )
}


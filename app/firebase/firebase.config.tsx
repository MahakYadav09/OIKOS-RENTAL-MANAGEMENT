import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from 'firebase/auth'
import { getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBjC-0E8MLP5XUA8lmqYVqp4ygDymWdkng",
  authDomain: "oikos-1a89c.firebaseapp.com",
  projectId: "oikos-1a89c",
  storageBucket: "oikos-1a89c.firebasestorage.app",
  messagingSenderId: "120092885076",
  appId: "1:120092885076:web:1fe3671e6fada02f922dc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage };
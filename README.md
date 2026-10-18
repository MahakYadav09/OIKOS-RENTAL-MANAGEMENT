# 🏠 Oikos - Property Rental Platform

A modern, feature-rich property rental application built with React Native and Expo, offering seamless property search, booking, and management experiences.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🔍 Advanced Search System
- **Smart Location Search** - Find properties by city, state, or area with case-insensitive matching
- **Comprehensive Filters**
  - Price range slider (₹1,000 - ₹75,000)
  - Bedrooms and bathrooms count
  - Property type (Hotel, Apartment, Villa, Resort, House)
  - Amenities selection (WiFi, Kitchen, AC, Parking, etc.)
- **Real-time Firestore Integration** - Fetch properties dynamically based on search criteria
- **Hybrid Query System** - Optimized Firestore queries with in-memory filtering for complex searches

### 📱 Recent Search Management
- **AsyncStorage Persistence** - Save search history across app sessions
- **Quick Access** - Click any recent search to repopulate search fields
- **Delete Functionality** - Remove unwanted searches with a single tap
- **Smart Deduplication** - Prevents duplicate location entries
- **Display Limit** - Shows 5 most recent searches, stores up to 10

### 🏡 Property Details
- **Rich Property Information**
  - Maximum guest capacity
  - Number of bedrooms and bathrooms
  - Property size (sq ft)
  - Host information with profile image
  - Property creation date
- **Image Gallery** - Horizontal scrollable photo carousel
- **Speciality Tags** - Peaceful, Unique, Family-friendly, Stylish, Central, Spacious
- **Comprehensive Amenities** - WiFi, TV, Kitchen, Washing Machine, Workspace, Parking, AC, Heating, Pool, Gym, and more

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface with smooth animations
- **Interactive Calendar** - Visual date range selection for bookings
- **Guest Counter** - Separate counters for adults, children, infants, and pets
- **Loading States** - Smooth loading indicators during data fetches
- **Empty States** - Helpful messages when no results found

### 🔐 Authentication & Roles
- **User Profiles** - Separate guest and host roles
- **Role-based Navigation** - Different interfaces for guests and hosts
- **Firebase Authentication** - Secure user management

### 📊 Data Management
- **Firestore Database** - Real-time cloud database for properties
- **Optimized Queries** - Efficient data fetching with pagination support
- **Field Flexibility** - Supports multiple field name variations for compatibility

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development and build toolchain
- **TypeScript** - Type-safe code
- **React Navigation** - Routing and navigation

### Backend & Database
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User authentication
- **Firebase Storage** - Image and file storage

### State Management & Storage
- **React Hooks** - useState, useEffect, useContext
- **AsyncStorage** - Local data persistence
- **Context API** - Global state management

### UI Components & Icons
- **Lucide React Native** - Beautiful icon library
- **React Native Safe Area Context** - Safe area handling
- **Custom Components** - Reusable UI components

## 📁 Project Structure

```
oikos/
├── app/
│   ├── (guest)/
│   │   ├── (tabs)/
│   │   │   ├── search/
│   │   │   │   ├── index.tsx          # Search page with filters
│   │   │   │   └── result.tsx         # Search results with Firestore
│   │   │   └── index.tsx              # Guest home
│   │   └── detail/
│   │       └── [id].tsx               # Property detail page
│   ├── (host)/
│   │   └── (tabs)/                    # Host dashboard
│   ├── firebase/
│   │   └── firebase.config.tsx        # Firebase configuration
│   └── index.tsx                      # App entry point
├── components/
│   ├── cards/
│   │   ├── listingCard.tsx           # Property card component
│   │   └── hotelCard.tsx             # Hotel card variant
│   └── model/
│       ├── filter.tsx                # Filter modal
│       └── BookingModal.tsx          # Booking modal
├── context/
│   ├── guest/
│   │   ├── UserContext.tsx           # User context
│   │   ├── PropertyListContext.js    # Property list context
│   │   └── BookingListContext.js     # Booking context
│   └── host/
│       └── propertyOnboarding.tsx    # Host property management
└── assets/                           # Images and static files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/oikos.git
cd oikos
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication
   - Copy your Firebase config to `app/firebase/firebase.config.tsx`

4. **Start the development server**
```bash
npx expo start
```

5. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## 📱 Firestore Data Structure

### Properties Collection
```typescript
{
  id: string,
  title: string,
  description: string,
  price: number,
  propertyType: "hotel" | "apartment" | "villa" | "resort" | "house",
  address: {
    city: string,
    state: string,
    country: string
  },
  basicData: {
    guest: number,
    bedrooms: number,
    bathrooms: number,
    size: number
  },
  amenities: string[],
  speciality: string[],
  photos: string[],
  hostName: string,
  hostImage: string,
  createdAt: Timestamp
}
```

## 🎯 Key Features Implementation

### Search System
- **Location-based filtering** with case-insensitive matching
- **Dynamic Firestore queries** with optimized constraints
- **In-memory filtering** for complex multi-criteria searches
- **Real-time results** with loading states

### Filter System
- **Modal-based filters** with clean UI
- **State management** for filter values
- **Callback pattern** to pass filters to parent components
- **Clear all functionality** to reset filters

### Recent Searches
- **AsyncStorage integration** for persistence
- **Automatic save** on search submission
- **Click to populate** search fields
- **Individual delete** with X button
- **Timestamp-based sorting** (most recent first)

## 🔧 Configuration

### Firebase Setup
Update `app/firebase/firebase.config.tsx` with your credentials:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Environment Variables
Create a `.env` file:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
```

## 🐛 Known Issues & Solutions

### Firestore Query Limitations
- **Issue**: Firestore allows only ONE range query per query
- **Solution**: Use exact match queries in Firestore, apply range filters in-memory
- **Impact**: Slightly more data transfer, but enables unlimited filter combinations

### AsyncStorage
- **Requirement**: `@react-native-async-storage/async-storage` must be installed
- **Installation**: `npx expo install @react-native-async-storage/async-storage`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Native community
- Expo team
- Firebase documentation
- Lucide icons
- All contributors
- 
## 🚀 Installation

1. Download the APK
2. Enable **Install from unknown sources**
3. Install & enjoy 🎉

## 📲 Download
👉 [Click here to download the APK](https://drive.google.com/file/d/1roZSZAObfd5z_p-g2gJnfhhZnvw1jejw/view?usp=sharing)

## 📞 Support

For support, email support@oikos.com or join our Slack channel.

---

**Made with ❤️ using React Native & Expo**

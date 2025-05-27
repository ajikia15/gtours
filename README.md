# gtours - Your Next Adventure Awaits!

Welcome to `gtours`, a modern web application designed to showcase exciting travel destinations and tour packages.

## 🚀 Powered By

This project leverages a powerful stack to deliver a fast, scalable, and maintainable application:

- **Next.js 15 (App Router):** Utilizing the latest features for efficient routing, data fetching, and server-side rendering. I've embraced the **App Router** architecture and implemented **server components** where appropriate to optimize performance and reduce client-side JavaScript.
- **next-intl:** Comprehensive internationalization (i18n) integration, managing locale-based routing and content translation (e.g., English, Georgian, Russian) for a truly global user experience.
- **Firebase:** Employed as a robust baaS for data storage (Firestore), user authentication, and image hosting (Firebase Storage).
- **TypeScript:** Ensuring code quality, type safety, and developer productivity across the entire codebase.
- **React Simple Maps:** For displaying interactive and engaging maps of tour locations.
- **React Markdown:** To render rich text descriptions for tours, allowing for formatted content.

## ✨ Key Highlights

- **Modern Architecture:** Built with Next.js 15's App Router for a highly performant and maintainable structure.
- **Comprehensive Internationalization:** Extensive localization support with `next-intl`, providing tour details and UI elements in multiple languages (EN, GE, RU).
- **Rich Tour Management & Admin Dashboard:** Features a dedicated admin section for creating, editing (with Markdown support), and managing tour information, including details like pricing, duration, and status.
- **Interactive Maps:** Utilizes `react-simple-maps` to visually represent tour locations, enhancing user engagement.
- **User Authentication:** Secure authentication flow allowing users to register and log in, including options like "Continue with Google."
- **Multi-Image Uploads:** Integrated solution for uploading and managing multiple images for each tour, hosted on Firebase Storage.
- **Full-Stack Development:** Demonstrates proficiency in both frontend (React, Next.js, TypeScript) and backend integration (Firebase Firestore & Storage).
- **Scalable & Maintainable Code:** Written in TypeScript with a focus on clean code, best practices, and clear separation of concerns.

Dive into the codebase to see how these technologies integrate to power a dynamic tour management platform, from user authentication and multi-language support to interactive maps and rich content display.

## 🔧 Firebase Phone Authentication Setup

To resolve `auth/invalid-app-credential` errors, you need to enable Phone Authentication:

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Find **Phone** in the list and click the edit icon
5. **Enable** the Phone provider
6. Click **Save**

### 2. Add Authorized Domains

1. In the same **Sign-in method** tab
2. Scroll down to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourdomain.com`)

### 3. SMS Configuration

- Firebase provides free SMS quota for testing
- For production, you may need to enable billing
- Georgian numbers (+995) are supported globally

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Go to the account page
3. Try adding a Georgian phone number (+995XXXXXXXXX)
4. You should receive an SMS verification code

## 📱 Supported Phone Numbers

This application is configured for **Georgian phone numbers only**:

- Format: `+995 XXX XXX XXX`
- The system automatically formats numbers as you type
- Only +995 country code is accepted

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env.local` file in your project root with the following Firebase configuration:

```bash
# Firebase Configuration
# Get these values from Firebase Console > Project Settings > General > Your apps

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for server-side operations)
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key_here
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PROJECT_ID=your_project_id
```

### How to get Firebase config values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click Settings ⚙️ → Project settings
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" and select Web
6. Copy the config values from the Firebase SDK snippet

## 📋 Features

- ✅ Firebase Authentication (Email/Password + Google)
- ✅ Phone Number Verification (Georgian numbers)
- ✅ User Profile Management
- ✅ Next.js 15 App Router
- ✅ International Routing (next-intl)
- ✅ Firestore Database Integration

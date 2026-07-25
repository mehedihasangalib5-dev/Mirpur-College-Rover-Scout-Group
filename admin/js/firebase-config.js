/* ---------------------------------------------------------
   FIREBASE-CONFIG.JS
   -----------------------------------------------------------
   1. Go to https://console.firebase.google.com → create/open
      your project → ⚙️ Project settings → General tab →
      "Your apps" → Web app (</> icon) → copy the config object
      shown there and paste the values below.
   2. In the same Firebase project, turn on:
        Build → Authentication → Sign-in method → Email/Password
        Build → Firestore Database → Create database
   3. See admin/FIREBASE-SETUP.md in this project for the full
      step-by-step setup guide (creating the first Super Admin,
      Firestore security rules, etc).
--------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyD91YXaZqjq88QA2olFS9dZqT1C5FscGcI",
  authDomain: "mirpur-college-rover-scout.firebaseapp.com",
  projectId: "mirpur-college-rover-scout",
  storageBucket: "mirpur-college-rover-scout.firebasestorage.app",
  messagingSenderId: "518944819264",
  appId: "1:518944819264:web:fc9c819aa3a75dfd1a77a5"
};

firebase.initializeApp(firebaseConfig);

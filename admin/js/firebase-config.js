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
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

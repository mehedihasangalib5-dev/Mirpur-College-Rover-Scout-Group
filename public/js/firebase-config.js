/* ---------------------------------------------------------
   FIREBASE-CONFIG.JS (public site)
   -----------------------------------------------------------
   এটা admin/js/firebase-config.js এর মতোই — একই Firebase প্রজেক্ট
   ব্যবহার করলে সেখান থেকে config অবজেক্টটা কপি করে এখানে বসিয়ে দাও
   (দুই জায়গায় same values, শুধু ফাইল আলাদা)।

   ধাপে ধাপে গাইড: public/MEMBER-FIREBASE-SETUP.md দেখো।
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

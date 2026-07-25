/* ---------------------------------------------------------
   FIREBASE-CONFIG.JS (public site)
   -----------------------------------------------------------
   এটা admin/js/firebase-config.js এর মতোই — একই Firebase প্রজেক্ট
   ব্যবহার করলে সেখান থেকে config অবজেক্টটা কপি করে এখানে বসিয়ে দাও
   (দুই জায়গায় same values, শুধু ফাইল আলাদা)।

   ধাপে ধাপে গাইড: public/MEMBER-FIREBASE-SETUP.md দেখো।
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

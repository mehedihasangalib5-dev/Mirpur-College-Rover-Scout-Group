# Member Portal — Firebase (Firestore) সেটআপ গাইড

এখন রেজিস্ট্রেশন ফর্ম সাবমিট করলে Firestore-এর `applications`
কালেকশনে (pending) সেভ হয় — Admin Panel-এর **Applications** পেজ থেকে
Approve করলেই সেটা আসল `members` কালেকশনে চলে যায় এবং Public সাইট
জুড়ে (Member Portal-সহ) দেখা যায়; Reject করলে মুছে যায়। শুধু নিচের
ধাপগুলো অনুসরণ করে তোমার Firebase প্রজেক্টের সাথে যুক্ত করে দাও।

**Firebase project আগে থেকেই আছে** — admin panel এর জন্য
(`admin/FIREBASE-SETUP.md` দেখো)। সেই **একই প্রজেক্ট** এখানেও ব্যবহার
করবে, শুধু আলাদা Firestore collection (`members`) ব্যবহার হবে, তাই নতুন
প্রজেক্ট বানানোর দরকার নেই।

## ধাপ ১ — Config বসাও

Firebase Console → তোমার প্রজেক্ট → ⚙️ Project settings → General →
"Your apps" থেকে (আগেই বানানো Web app, admin panel এর জন্য যেটা
বানিয়েছিলে) `firebaseConfig` অবজেক্টের মানগুলো কপি করে
`public/js/firebase-config.js` ফাইলে বসাও (`PASTE_YOUR_...` জায়গাগুলোতে
— ঠিক `admin/js/firebase-config.js` এ যা বসিয়েছিলে, একই মান)।

## ধাপ ২ — Firestore Security Rules

পুরো rules block-টা (সব কালেকশন — `admins`, `members`, `events`,
`gallery`, `notices`, `certificates`, `applications`) admin panel-এর
`admin/FIREBASE-SETUP.md`-এর ধাপ ৫-এ দেওয়া আছে — সেটাই একবার বসিয়ে
দিলে এই public সাইটের সব ফিচার (রেজিস্ট্রেশন, Member Portal, Events,
Gallery, News/Notices) সব একসাথে কাজ করবে, আলাদা করে কিছু বসাতে হবে
না।

## নিরাপত্তা নোট

visitor ব্রাউজার থেকে সরাসরি `members` কালেকশনে কিছু লিখতে/এডিট
করতে পারে না — শুধু `applications`-এ নতুন pending আবেদন তৈরি করতে
পারে (`allow create`)। সেটাকে `members`-এ move করা হয় শুধুমাত্র
লগইন করা admin-এর Approve বাটন থেকে। প্রোফাইল এডিট এখনও সরাসরি
সাইট থেকে করা যায় না — দরকার হলে Firebase Console → Firestore
Database → `members` কালেকশনে গিয়ে সরাসরি করতে হবে (Console-এ
প্রজেক্ট মালিক হিসেবে ঢুকলে security rules প্রযোজ্য হয় না)।

## ধাপ ৩ — টেস্ট করো

1. `public/js/firebase-config.js` এ মান বসানোর পর সাইট রিলোড করো
   (localhost অথবা লাইভ ডোমেইন)।
2. রেজিস্ট্রেশন ফর্ম পূরণ করে সাবমিট করো।
3. Firebase Console → Firestore Database এ গিয়ে দেখো `applications`
   কালেকশনে নতুন একটা pending document তৈরি হয়েছে কিনা।
4. Admin Panel → Applications পেজে গিয়ে ওই আবেদনটা Approve করো —
   এবার `members` কালেকশনে সেটা চলে যাবে এবং Member Portal পেজে
   প্রোফাইলটা দেখাবে।
5. Firebase Console → Firestore Database → `members` কালেকশনে গিয়ে
   ওই document-এর কোনো field (যেমন mobile) পরিবর্তন করে Save করো —
   Member Portal পেজে ফিরে গিয়ে (রিলোড ছাড়াই) দেখো পরিবর্তনটা সাথে
   সাথে দেখাচ্ছে কিনা (লাইভ sync এর প্রমাণ)।
6. পেজ রিলোড দিয়ে (Ctrl+Shift+R দিয়ে হার্ড রিফ্রেশ) নিশ্চিত হও যে
   ডেটা এখনো আছে — মানে Firestore থেকেই লোড হচ্ছে, local memory থেকে না।

## কোড কীভাবে কাজ করে (সংক্ষেপে)

- `public/js/app.js` এর `startMembersListener()` পেজ লোড হওয়ার সাথে
  সাথে Firestore এর `members` কালেকশনে লাইভ শুনতে শুরু করে
  (`onSnapshot`) — কেউ নতুন করে যোগ/এডিট করলে সাথে সাথে সব ভিজিটরের
  পেজেও আপডেট হয়ে যাবে, রিলোড ছাড়াই।
- `submitRegister()` Firestore এর `applications` কালেকশনে নতুন
  document লেখে (`.doc(rovId).set(...)`), document এর ID-ই Rover ID।
- Admin Panel-এর Approve বাটন সেই document-টাকে `members`
  কালেকশনে কপি করে `applications` থেকে মুছে দেয়
  (`admin/js/firebase-content.js` এর `fbApproveApplication`)।
- প্রোফাইল edit/delete সাইট থেকে করা যায় না (rules এ বন্ধ) — শুধু
  Firebase Console থেকে করতে হবে।
- যদি `firebase-config.js` এখনো বসানো না থাকে (placeholder মান),
  কোড বুঝে যায় (`fbMembersReady()`) আর আগের মতো শুধু local
  (browser-memory-only) ভাবে কাজ চালিয়ে যায় — সাইট ভাঙে না।

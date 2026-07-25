# Admin Panel — Firebase Authentication সেটআপ গাইড

এই admin panel-এ এখন **real Firebase Authentication** যুক্ত করা হয়েছে
(আগের ডেমো "যেকোনো পাসওয়ার্ড + অ্যাক্সেস কী" পদ্ধতির বদলে)। Role
(Super Admin / Leader / Editor) সংরক্ষিত থাকে **Firestore**-এ, যাতে
একাধিক ডিভাইস/ব্রাউজার থেকে সব admin-এর role একই থাকে।

## ধাপ ১ — Firebase প্রজেক্ট তৈরি

1. https://console.firebase.google.com এ যান, **Add project** করুন
   (আগে থেকে থাকলে সেটাই ব্যবহার করুন)।
2. প্রজেক্টের ভেতরে ⚙️ **Project settings → General** ট্যাবে যান।
3. নিচের দিকে **"Your apps"** সেকশনে **Web (</>)** আইকনে ক্লিক করে
   একটা ওয়েব অ্যাপ রেজিস্টার করুন (Firebase Hosting লাগবে না, স্কিপ
   করে দিন)। এতে একটা `firebaseConfig` অবজেক্ট দেখাবে।
4. সেই মানগুলো কপি করে `admin/js/firebase-config.js` ফাইলে বসিয়ে দিন
   (`PASTE_YOUR_...` লেখা জায়গাগুলোতে)।

## ধাপ ২ — Email/Password Sign-in চালু করুন

Firebase Console → **Build → Authentication → Get started →
Sign-in method** ট্যাব → **Email/Password** প্রোভাইডার চালু (Enable)
করুন এবং Save করুন।

## ধাপ ৩ — Firestore Database তৈরি করুন

Firebase Console → **Build → Firestore Database → Create database**।
Location যেকোনো কাছাকাছি region দিন, এবং **Production mode**-এ শুরু
করুন (নিচের সিকিউরিটি রুলস বসিয়ে দেবেন — ধাপ ৫ দেখুন)।

## ধাপ ৪ — প্রথম Super Admin তৈরি করুন

যেহেতু self-signup ফ্লো নেই (আপনি নিজে console থেকেই তৈরি করবেন
বলেছেন), প্রথম Super Admin দুই জায়গায় বানাতে হবে:

**ক) Firebase Authentication-এ একটা ইউজার বানান**
Firebase Console → Authentication → **Users** ট্যাব →
**Add user** → ইমেইল ও পাসওয়ার্ড দিন → Add user।

**খ) Firestore-এ সেই ইমেইলের জন্য role লিখুন**
Firebase Console → Firestore Database → **Start collection** →
- Collection ID: `admins`
- Document ID: ঠিক সেই ইমেইলটাই, ছোট হাতের অক্ষরে (lowercase),
  যেমন `admin@example.com`
- Fields:
  | Field     | Type   | Value                      |
  |-----------|--------|----------------------------|
  | email     | string | admin@example.com          |
  | role      | string | superadmin                 |
  | addedBy   | string | console                    |

এই দুটো ধাপ শেষ হলে আপনি admin panel-এ ওই ইমেইল+পাসওয়ার্ড দিয়ে
Super Admin হিসেবে লগইন করতে পারবেন।

## ধাপ ৫ — Firestore Security Rules

Firestore Database → **Rules** ট্যাবে গিয়ে নিচেরটা বসান (শুধুমাত্র
লগইন করা admin-রাই `admins` কালেকশন পড়তে পারবে, আর শুধু superadmin
role-এর কেউ নতুন করে লিখতে/মুছতে পারবে):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admins/{emailId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && exists(/databases/$(database)/documents/admins/$(request.auth.token.email))
                   && get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.role == "superadmin";
    }
  }
}
```

**Publish** চাপতে ভুলবেন না।

⚠️ **এটা শুধু `admins` কালেকশনের rule।** Members/Registrations,
Events, Gallery, ও Notices পেজগুলো থেকে Save/Publish/Delete করলে সেটা
আসলেই সংরক্ষণ হওয়ার জন্য, আর পাবলিক ওয়েবসাইটেও দেখানোর জন্য, আরও
কয়েকটা কালেকশনের (`members`, `events`, `gallery`, `notices`) rule
লাগবে — সেই সম্পূর্ণ rules block-টা `public/MEMBER-FIREBASE-SETUP.md`
এর "ধাপ ২" এ আছে, ওখান থেকে পুরোটা কপি করে বসান (এই `admins` অংশটাও
তার ভেতরেই আছে, আলাদা করে দুইবার বসানোর দরকার নেই)।

## পরবর্তী অ্যাডমিন/এডিটর যোগ করা

Admin Panel → **User Management** পেজ থেকে একজন সুপার অ্যাডমিন কোনো
ইমেইলকে "Super Admin" বা "Leader" role দিতে পারবেন (একইভাবে Leader
কাউকে "Editor" বানাতে পারবে) — এটা Firestore-এ role সংরক্ষণ করে।

⚠️ কিন্তু এটা শুধু role assign করে — ওই ব্যক্তি আসলে লগইন করতে পারার
জন্য তার একটা Firebase Authentication অ্যাকাউন্টও লাগবে, যেটা এখনো
আপনাকে ধাপ ৪(ক)-এর মতো Firebase Console → Authentication → Users →
Add user দিয়ে ম্যানুয়ালি বানিয়ে দিতে হবে (একই ইমেইল দিয়ে)।

## লোকালি চালিয়ে টেস্ট করা

```bash
node server.js
```
তারপর http://localhost:3000/admin/ খুলুন এবং ধাপ ৪-এ বানানো
ইমেইল/পাসওয়ার্ড দিয়ে লগইন করুন।

## নিরাপত্তা নোট

- `firebase-config.js`-এর ভেতরের API key ব্রাউজারে সবসময় দৃশ্যমান
  থাকে — এটা Firebase-এর normal ডিজাইন (এটা কোনো secret না); আসল
  সুরক্ষা আসে Firestore Security Rules ও Authentication থেকে, তাই
  ধাপ ৫-এর Rules বসানো জরুরি।
- চাইলে পরে Firebase App Check যোগ করে বট/স্প্যাম ট্রাফিক আরও কমানো
  যায়, কিন্তু এটা এখনকার জন্য প্রয়োজনীয় না।

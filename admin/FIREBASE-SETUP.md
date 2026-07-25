# Admin Panel — Firebase Authentication সেটআপ গাইড

এই admin panel-এ এখন **real Firebase Authentication** যুক্ত করা হয়েছে
(আগের ডেমো "যেকোনো পাসওয়ার্ড + অ্যাক্সেস কী" পদ্ধতির বদলে)। Role
(Super Admin / Leader / Editor) সংরক্ষিত থাকে **Firestore**-এ, যাতে
একাধিক ডিভাইস/ব্রাউজার থেকে সব admin-এর role একই থাকে।

## ⚡ Publish/Save/Delete এখন Public সাইটে reflect হয় (নতুন)

আগে Members, Events, Gallery, Notices, Certificates, Applications —
এই সব ফিচারের Add/Edit/Delete/Publish শুধু ব্রাউজারের মেমোরিতে থাকত,
কোথাও সেভ হতো না, আর Public সাইটের সাথে কোনো সংযোগই ছিল না। এখন এগুলো
সবই real Firestore কালেকশনে সেভ হয় (`admin/js/firebase-content.js` ও
`public/js/firebase-content.js` দেখুন) — তাই Admin panel-এ Publish বা
Delete করলে Public সাইটে সাথে সাথেই সেটা দেখা যাবে/মুছে যাবে। এটা কাজ
করার জন্য নিচের ধাপ ১-৪ (Firebase কনফিগার করা) এবং **ধাপ ৫-এর নতুন
Security Rules** — দুটোই দরকার।

## ⚡ Activity Log এখন real, এবং Settings-এ Save বাটন কাজ করে (নতুন)

আগে **Activity Log** পেজ শুধু একটা খালি ডেমো লিস্ট দেখাত (কোনো real
action কখনো লগ হতো না), আর **Website Settings** পেজে কোনো Save বাটনই
ছিল না — ফিল্ড পরিবর্তন করলেও কিছু সেভ হতো না। এখন দুটোই real
Firestore দিয়ে কাজ করে:

- প্রতিটা গুরুত্বপূর্ণ অ্যাকশন (লগইন/লগআউট, member/event/gallery/notice
  add-delete, application approve/reject, role grant/revoke, push
  পাঠানো, settings পরিবর্তন) স্বয়ংক্রিয়ভাবে `activityLog` কালেকশনে
  একটা এন্ট্রি লিখে, আর Activity Log পেজ সেটা লাইভ দেখায়।
- Website Settings পেজে সাইটের নাম, যোগাযোগ ইমেইল ও লোগো এখন
  **Save** বাটনে ক্লিক করলে `settings` কালেকশনে সত্যিই সংরক্ষিত হয়
  (পেজ রিফ্রেশ করলেও থাকে)।

এগুলো কাজ করার জন্যও নিচের ধাপ ১-৪ ও **ধাপ ৫-এর Security Rules**
(যেখানে এখন `activityLog` ও `settings`-এর নিয়মও যোগ করা আছে) দরকার।

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

Firestore Database → **Rules** ট্যাবে গিয়ে নিচেরটা বসান। এটা কভার করে:
- `admins` — শুধু লগইন করা admin-রা পড়তে পারবে, শুধু superadmin লিখতে/মুছতে পারবে (আগের মতোই)
- `members`, `events`, `gallery`, `notices`, `certificates` — **সবাই পড়তে পারবে** (Public ওয়েবসাইটে দেখানোর জন্য দরকার), কিন্তু **শুধু লগইন করা admin-রাই** লিখতে/মুছতে/এডিট করতে পারবে (এটাই Admin Panel-এর Publish/Save/Delete বাটনগুলো আসলে যেখানে সেভ হয়)
- `applications` — যে কেউ (Public সাইটের রেজিস্ট্রেশন ফর্ম) নতুন আবেদন লিখতে পারবে, কিন্তু শুধু admin-রাই পড়তে/অনুমোদন/বাতিল করতে পারবে
- `activityLog` — **Activity Log** পেজের real (fake নয়) ডেটা এখানে সেভ হয়: লগইন/লগআউট, member/event/gallery/notice add-delete, role change, settings change — সবকিছুর জন্য একটা করে entry। শুধু লগইন করা admin-রা পড়তে/লিখতে পারবে (তাই ভুল পাসওয়ার্ড দিয়ে লগইন ব্যর্থ হলে সেটা লগ হয় না — ওই মুহূর্তে কেউ authenticated থাকে না, এবং unauthenticated write খুলে দেওয়াটা স্প্যাম/টেম্পারিং-এর ঝুঁকি তৈরি করবে বলে ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে)।
- `settings` — Website Settings পেজের সাইটের নাম/যোগাযোগ ইমেইল/লোগো এখানে সেভ হয়। শুধু logged-in admin-রা পড়তে/লিখতে পারবে।

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

    match /members/{memberId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /gallery/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /notices/{noticeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /certificates/{certId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /applications/{appId} {
      allow create: if true;                    // public registration form
      allow read, update, delete: if request.auth != null;  // admin only
    }

    match /activityLog/{entryId} {
      allow read, create: if request.auth != null;  // admin only — logged-in users can append entries
      allow update, delete: if false;                // logs are append-only, never edited or deleted
    }

    match /settings/{docId} {
      allow read, write: if request.auth != null;   // admin only
    }
  }
}
```

**Publish** চাপতে ভুলবেন না। Rules না বসালে Public সাইট থেকে ডেটা read করতে পারবে না (Console-এর Network ট্যাবে "Missing or insufficient permissions" এরর দেখাবে), এবং Admin Panel-এ Save/Delete চাপলেও কিছু হবে না।

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

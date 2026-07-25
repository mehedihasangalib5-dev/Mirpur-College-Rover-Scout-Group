# Member Portal — Firebase (Firestore) সেটআপ গাইড

এখন রেজিস্ট্রেশন ফর্ম সাবমিট করলে Firestore-এ সেভ হওয়ার জন্য কোড রেডি
করা আছে (প্রোফাইল এডিট সাইট থেকে করা যায় না — সরাসরি Firebase Console
থেকে করবে, নিচে বলা আছে)। শুধু নিচের ধাপগুলো অনুসরণ করে তোমার Firebase
প্রজেক্টের সাথে যুক্ত করে দাও।

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

Firebase Console → Firestore Database → **Rules** ট্যাবে গিয়ে
`admins` কালেকশনের rule এর পাশে `members` কালেকশনের জন্য এটা যোগ করো:

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
      allow create: if true;
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

**Publish** চাপতে ভুলো না।

## নিরাপত্তা নোট

`allow update: if false` মানে — কোনো ভিজিটর ব্রাউজার থেকে কোনো
প্রোফাইল এডিট করতে পারবে না (শুধু নতুন রেজিস্ট্রেশন যোগ করতে পারবে,
`allow create: if true`)। প্রোফাইল এডিট এখন শুধু তুমি নিজে Firebase
Console → Firestore Database → `members` কালেকশনে গিয়ে সরাসরি করবে
— Console-এ প্রজেক্ট মালিক হিসেবে ঢুকলে এই security rules প্রযোজ্য হয়
না, তাই তুমি সবসময় edit/delete করতে পারবে।

## ধাপ ৩ — টেস্ট করো

1. `public/js/firebase-config.js` এ মান বসানোর পর সাইট রিলোড করো
   (localhost অথবা লাইভ ডোমেইন)।
2. রেজিস্ট্রেশন ফর্ম পূরণ করে সাবমিট করো।
3. Firebase Console → Firestore Database এ গিয়ে দেখো `members`
   কালেকশনে নতুন একটা document তৈরি হয়েছে কিনা।
4. Member Portal পেজে গিয়ে দেখো প্রোফাইলটা দেখাচ্ছে কিনা।
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
- `submitRegister()` Firestore এ নতুন document লেখে (`.doc(rovId).set(...)`),
  document এর ID-ই Rover ID।
- প্রোফাইল edit/delete সাইট থেকে করা যায় না (rules এ বন্ধ) — শুধু
  Firebase Console থেকে করতে হবে।
- যদি `firebase-config.js` এখনো বসানো না থাকে (placeholder মান),
  কোড বুঝে যায় (`fbMembersReady()`) আর আগের মতো শুধু local
  (browser-memory-only) ভাবে কাজ চালিয়ে যায় — সাইট ভাঙে না।

/* ---------------------------------------------------------
   DATA.JS — i18n dictionary + content data
   Mirpur College Rover Scout Group — public website
--------------------------------------------------------- */

function L(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.bn || obj.en || "";
}

const ORG = {
  name: { bn: "মিরপুর কলেজ রোভার স্কাউট গ্রুপ", en: "Mirpur College Rover Scout Group" },
  short: { bn: "এমসিআরএসজি", en: "MCRSG" },
  tagline: { bn: "মিরপুর কলেজ, মিরপুর-২, ঢাকা", en: "Mirpur College, Mirpur-2, Dhaka" },
  // Change these two to update the Contact page map:
  //  - mapQuery: the address/place name to embed (no API key needed)
  //  - mapLink: the "Open in Google Maps" button target (a normal
  //    maps.google.com or maps.app.goo.gl share link works fine)
  mapQuery: "Mirpur College, Mirpur-2, Dhaka, Bangladesh",
  mapLink: "https://maps.app.goo.gl/X9S156sVyBB2xXkK8",
};

const UI = {
  menu: { bn: "মেনু", en: "Menu" },
  search: { bn: "খুঁজুন", en: "Search" },
  searchPlaceholder: { bn: "পাতা, সংবাদ, ইভেন্ট খুঁজুন...", en: "Search pages, news, events..." },
  noResults: { bn: "কোনো ফলাফল পাওয়া যায়নি", en: "No results found" },
  joinNow: { bn: "এখনই যোগ দিন", en: "Join Now" },
  learnMore: { bn: "আরও জানুন", en: "Learn More" },
  registerBtn: { bn: "রেজিস্ট্রেশন করুন", en: "Register" },
  download: { bn: "ডাউনলোড", en: "Download" },
  sendMessage: { bn: "বার্তা পাঠান", en: "Send Message" },
  yourName: { bn: "আপনার নাম", en: "Your Name" },
  email: { bn: "ইমেইল", en: "Email" },
  yourMessage: { bn: "আপনার বার্তা লিখুন", en: "Write your message" },
  applicationReceived: { bn: "আবেদন গৃহীত হয়েছে", en: "Application Received" },
  applicationReceivedSub: { bn: "আমরা শীঘ্রই আপনার আবেদন যাচাই করে যোগাযোগ করব।", en: "We'll review your application and get in touch soon." },
  newApplication: { bn: "নতুন আবেদন করুন", en: "Start a New Application" },
  submitApplication: { bn: "আবেদন জমা দিন", en: "Submit Application" },
  selectOption: { bn: "নির্বাচন করুন", en: "Select" },
  male: { bn: "ছেলে", en: "Male" },
  female: { bn: "মেয়ে", en: "Female" },
  gender: { bn: "লিঙ্গ", en: "Gender" },
  photo: { bn: "পাসপোর্ট সাইজ ছবি", en: "Passport-size Photo" },
  signature: { bn: "স্বাক্ষর (টাইপ করুন)", en: "Signature (type here)" },
  participants: { bn: "অংশগ্রহণকারী", en: "Participants" },
  mobile: { bn: "মোবাইল", en: "Mobile" },
  institution: { bn: "প্রতিষ্ঠান", en: "Institution" },
  joiningDate: { bn: "যোগদানের তারিখ", en: "Joining Date" },
  rank: { bn: "রোভার র‍্যাংক", en: "Rover Rank" },
  certificates: { bn: "সার্টিফিকেট", en: "Certificates" },
  achieved3: { bn: "৩টি অর্জিত", en: "3 earned" },
  bloodGroup: { bn: "রক্তের গ্রুপ", en: "Blood Group" },
  attendanceRate: { bn: "উপস্থিতির হার", en: "Attendance Rate" },
  badgeCollection: { bn: "ব্যাজ ও প্রোগ্রেস কালেকশন", en: "Badge & Progress Collection" },
  toggleTheme: { bn: "থিম পরিবর্তন করুন", en: "Toggle theme" },
  toggleLang: { bn: "EN", en: "বাং" },
  teamDivision: { bn: "দল বিভাজন", en: "Team Division" },
  dutyRoster: { bn: "দায়িত্ব বণ্টন", en: "Duty Roster" },
  campSchedule: { bn: "ক্যাম্প সময়সূচি", en: "Camp Schedule" },
  activeCamps: { bn: "সক্রিয় ক্যাম্প", en: "Active Camps" },
  avgAttendance: { bn: "গড় উপস্থিতি", en: "Avg. Attendance" },
  totalCamps: { bn: "সর্বমোট আয়োজিত ক্যাম্প", en: "Total Camps Held" },
  scoutMotto: { bn: "সেবাই ধর্ম · বন্ধুত্বই শক্তি", en: "Service Before Self · Strength in Fellowship" },
  scoutPromise: { bn: "রোভার স্কাউট প্রতিজ্ঞা", en: "Rover Scout Promise" },
  scoutLaw: { bn: "স্কাউট আইন", en: "Scout Law" },
  ageRange: { bn: "বয়সসীমা", en: "Age Range" },
  logbook: { bn: "রোভার লগ বুক", en: "Rover Log Book" },
  applicantRank: { bn: "আবেদনকারী (অনুমোদনের অপেক্ষায়)", en: "Applicant (pending approval)" },
  noBadgesYet: { bn: "এখনো কোনো ব্যাজ অর্জন করেনি", en: "No badges earned yet" },
  newlyAdded: { bn: "নতুন", en: "New" },
  noMembersYet: { bn: "এখনো কোনো সদস্য নিবন্ধিত হয়নি। রেজিস্ট্রেশন ফর্ম পূরণ করলে এখানে প্রোফাইল দেখা যাবে।", en: "No members registered yet. Submit the registration form to see a profile here." },
};

const NAV_GROUPS = [
  { title: { bn: "মূল পাতা", en: "Main" }, items: [
    { id: "home", label: { bn: "হোম", en: "Home" }, icon: "compass" },
    { id: "about", label: { bn: "আমাদের সম্পর্কে", en: "About Us" }, icon: "book-open" },
    { id: "leadership", label: { bn: "নেতৃত্ব", en: "Leadership" }, icon: "shield-check" },
  ]},
  { title: { bn: "রোভার এলাকা", en: "Rover Area" }, items: [
    { id: "portal", label: { bn: "রোভার পোর্টাল", en: "Rover Portal" }, icon: "user" },
    { id: "register", label: { bn: "অনলাইন রেজিস্ট্রেশন", en: "Online Registration" }, icon: "file-text" },
    { id: "events", label: { bn: "রোভারিং কার্যক্রম", en: "Rovering Activities" }, icon: "calendar" },
    { id: "camp", label: { bn: "ক্যাম্প ম্যানেজমেন্ট", en: "Camp Management" }, icon: "tent" },
    { id: "badges", label: { bn: "ব্যাজ ও প্রোগ্রেস", en: "Badges & Progress" }, icon: "award" },
    { id: "achievement", label: { bn: "অর্জন", en: "Achievements" }, icon: "trophy" },
  ]},
  { title: { bn: "রিসোর্স", en: "Resources" }, items: [
    { id: "gallery", label: { bn: "গ্যালারি", en: "Gallery" }, icon: "camera" },
    { id: "downloads", label: { bn: "ডাউনলোড", en: "Downloads" }, icon: "download" },
    { id: "news", label: { bn: "সংবাদ", en: "News" }, icon: "message-square" },
    { id: "contact", label: { bn: "যোগাযোগ", en: "Contact" }, icon: "phone" },
  ]},
  { title: { bn: "লগইন", en: "Login" }, items: [
    { id: "login", label: { bn: "অ্যাডমিন লগইন", en: "Admin Login" }, icon: "key-round" },
  ]},
];

const STATS = [
  { label: { bn: "সক্রিয় রোভার সদস্য", en: "Active Rover Members" }, value: { bn: "১৪৫+", en: "145+" }, icon: "users" },
  { label: { bn: "রোভার ইউনিট (ক্রু)", en: "Rover Units (Crews)" }, value: { bn: "৬", en: "6" }, icon: "flag" },
  { label: { bn: "বার্ষিক সার্ভিস ক্যাম্প", en: "Annual Service Camps" }, value: { bn: "১২+", en: "12+" }, icon: "tent" },
  { label: { bn: "অর্জিত ব্যাজ ও অ্যাওয়ার্ড", en: "Badges & Awards Earned" }, value: { bn: "২৩০+", en: "230+" }, icon: "award" },
];

/* NEWS_SEED / EVENTS_SEED — demo content shown only until Firebase is
   connected (js/firebase-config.js). Once connected, the live NEWS /
   EVENTS variables below (kept in sync by js/firebase-content.js) take
   over completely, reflecting exactly what's Published in /admin. */
const NEWS_SEED = [
  { title: { bn: "রোভার বেসিক কোর্স (RBC) ব্যাচ-১২ সম্পন্ন", en: "Rover Basic Course (RBC) Batch-12 concludes" }, date: { bn: "১৮ জুলাই, ২০২৬", en: "18 July 2026" }, tag: { bn: "প্রতিবেদন", en: "Report" } },
  { title: { bn: "জাতীয় রোভার মুট ২০২৭ এর জন্য দল গঠন শুরু", en: "Team formation begins for National Rover Moot 2027" }, date: { bn: "১০ জুলাই, ২০২৬", en: "10 July 2026" }, tag: { bn: "ঘোষণা", en: "Announcement" } },
  { title: { bn: "নতুন সেশনে রোভার স্কোয়ার ভর্তি শুরু", en: "Rover Squire admissions open for new session" }, date: { bn: "০২ জুলাই, ২০২৬", en: "02 July 2026" }, tag: { bn: "নোটিশ", en: "Notice" } },
];

const EVENTS_SEED = [
  { title: { bn: "বার্ষিক সার্ভিস ক্যাম্প — মিরপুর", en: "Annual Service Camp — Mirpur" }, date: { bn: "১৫-১৭ ডিসেম্বর", en: "15–17 Dec" }, loc: { bn: "মিরপুর কলেজ ক্যাম্পাস", en: "Mirpur College Campus" }, seats: { bn: "৭৫/১০০", en: "75/100" } },
  { title: { bn: "পাহাড়ি হাইকিং ও ট্রেকিং অভিযান", en: "Hill Hiking & Trekking Expedition" }, date: { bn: "০৫ সেপ্টেম্বর", en: "05 Sep" }, loc: { bn: "বান্দরবান", en: "Bandarban" }, seats: { bn: "২৮/৪০", en: "28/40" } },
  { title: { bn: "রক্তদান ও কমিউনিটি সার্ভিস সপ্তাহ", en: "Blood Donation & Community Service Week" }, date: { bn: "২১-২৭ আগস্ট", en: "21–27 Aug" }, loc: { bn: "মিরপুর, ঢাকা", en: "Mirpur, Dhaka" }, seats: { bn: "৬০/৮০", en: "60/80" } },
];

const LEADERSHIP = [
  { role: { bn: "গ্রুপ সভাপতি (ভারপ্রাপ্ত অধ্যক্ষ)", en: "Group President (Acting Principal)" }, name: "ইফ্ফাত আজমী", icon: "shield-check" },
  { role: { bn: "রোভার স্কাউট লিডার (RSL) এবং গ্রুপ সম্পাদক", en: "Rover Scout Leader (RSL) & Group Secretary" }, name: "জনাব বুলবুল আলম", icon: "compass" },
  { role: { bn: "সিনিয়র রোভার মেট (SRM)", en: "Senior Rover Mate (SRM)" }, name: "মো: নাবিল সিদ্দিকী", icon: "flag" },
  { role: { bn: "সিনিয়র রোভার মেট (SRM)", en: "Senior Rover Mate (SRM)" }, name: "আফিয়া সুলতানা", icon: "star" },
];

/* Rover Scout section badges & awards — Bangladesh Scouts Rover programme,
   adapted for a college-level (18–25) Rover crew */
const BADGES = [
  { name: { bn: "রোভার স্কোয়ার", en: "Rover Squire" }, icon: "flag" },
  { name: { bn: "রোভার স্কাউট", en: "Rover Scout" }, icon: "compass" },
  { name: { bn: "সার্ভিস রোভার ব্যাজ", en: "Service Rover Badge" }, icon: "heart" },
  { name: { bn: "প্রেসিডেন্ট রোভার স্কাউট অ্যাওয়ার্ড", en: "President's Rover Scout Award" }, icon: "trophy" },
  { name: { bn: "রোভার মেট", en: "Rover Mate" }, icon: "star" },
  { name: { bn: "কমিউনিটি ডেভেলপমেন্ট ব্যাজ", en: "Community Development Badge" }, icon: "users" },
  { name: { bn: "এক্সপেডিশন ব্যাজ", en: "Expedition Badge" }, icon: "mountain" },
  { name: { bn: "প্রাথমিক চিকিৎসা ব্যাজ", en: "First Aid Badge" }, icon: "cross" },
];

const ACHIEVEMENTS = [
  { title: { bn: "জাতীয় রোভার মুট ২০২৪", en: "National Rover Moot 2024" }, detail: { bn: "৩২ জন রোভারের সফল অংশগ্রহণ", en: "32 rovers took part successfully" }, icon: "trophy" },
  { title: { bn: "ইন্টারন্যাশনাল সার্ভিস ক্যাম্প — নেপাল", en: "International Service Camp — Nepal" }, detail: { bn: "৫ জন প্রতিনিধি নির্বাচিত", en: "5 delegates selected" }, icon: "mountain" },
  { title: { bn: "প্রেসিডেন্ট রোভার স্কাউট অ্যাওয়ার্ড ২০২৫", en: "President's Rover Scout Award 2025" }, detail: { bn: "৯ জন রোভার সম্মানিত", en: "9 rovers honoured" }, icon: "graduation-cap" },
];

const GALLERY_SEED = ["camp1","hike2","badge3","group4","tent5","flag6","fire7","river8"];

const DOWNLOADS = [
  { name: { bn: "রোভার সদস্য রেজিস্ট্রেশন ফর্ম", en: "Rover Membership Registration Form" }, size: "245 KB · PDF", file: "downloads/registration-form.pdf" },
  { name: { bn: "রোভার লগ বুক টেমপ্লেট", en: "Rover Log Book Template" }, size: "410 KB · PDF", file: "downloads/rover-log-book-template.pdf" },
  { name: { bn: "নোটিশ — বার্ষিক সাধারণ সভা", en: "Notice — Annual General Meeting" }, size: "180 KB · PDF", file: "downloads/agm-notice.pdf" },
  { name: { bn: "রোভার হ্যান্ডবুক", en: "Rover Handbook" }, size: "6.2 MB · PDF", file: "downloads/rover-handbook.pdf" },
  { name: { bn: "বার্ষিক প্রতিবেদন ২০২৫", en: "Annual Report 2025" }, size: "3.1 MB · PDF", file: "downloads/annual-report-2025.pdf" },
  { name: { bn: "রোভার বেসিক কোর্স (RBC) সিলেবাস", en: "Rover Basic Course (RBC) Syllabus" }, size: "320 KB · PDF", file: "downloads/rbc-syllabus.pdf" },
];

const ABOUT_BLOCKS = [
  { title: { bn: "ইতিহাস", en: "History" }, body: { bn: "মিরপুর কলেজের প্রাঙ্গণে যাত্রা শুরু করা আমাদের রোভার স্কাউট গ্রুপ আজ কলেজের শতাধিক শিক্ষার্থীর নেতৃত্ব ও সেবার প্ল্যাটফর্মে পরিণত হয়েছে।", en: "Founded on the campus of Mirpur College, our Rover Scout Group has grown into a platform for leadership and service for hundreds of college students." }, icon: "book-open" },
  { title: { bn: "লক্ষ্য (Vision)", en: "Vision" }, body: { bn: "প্রতিটি তরুণ-তরুণীর মাঝে দায়িত্বশীল নেতৃত্ব ও সেবার মানসিকতা গড়ে তোলা।", en: "To build responsible leadership and a spirit of service in every young adult." }, icon: "star" },
  { title: { bn: "অভিলক্ষ্য (Mission)", en: "Mission" }, body: { bn: "রোভারিং, কমিউনিটি সার্ভিস ও ক্যাম্পিংয়ের মাধ্যমে চরিত্র ও নেতৃত্ব দক্ষতা বিকাশ।", en: "Developing character and leadership skills through rovering, community service, and camping." }, icon: "flag" },
  { title: { bn: "উদ্দেশ্য (Objectives)", en: "Objectives" }, body: { bn: "শৃঙ্খলা, স্বেচ্ছাসেবা, পরিবেশ সচেতনতা ও কর্মমুখী নেতৃত্ব দক্ষতা তৈরি করা।", en: "Cultivating discipline, volunteerism, environmental awareness, and career-ready leadership skills." }, icon: "check-circle" },
  { title: { bn: "রোভারিং কী", en: "What is Rovering" }, body: { bn: "রোভারিং হলো স্কাউট আন্দোলনের প্রাপ্তবয়স্ক পর্যায় (১৮-২৫ বছর) — এখানে সেবা, অভিযান ও নেতৃত্ব একসাথে চর্চা করা হয়।", en: "Rovering is the young-adult section of Scouting (ages 18–25), combining service, adventure, and leadership practice." }, icon: "compass" },
  { title: { bn: "সাংগঠনিক কাঠামো", en: "Organizational Structure" }, body: { bn: "কলেজ কর্তৃপক্ষ, রোভার স্কাউট লিডার (RSL) ও রোভার মেটদের সমন্বয়ে পরিচালিত গ্রুপ কমিটি।", en: "A Group Committee coordinated by the college authority, the Rover Scout Leader (RSL), and student Rover Mates." }, icon: "users" },
];

/* ---------------- live content ----------------
   These start out as copies of the demo seed data above, and are then
   replaced with live data from Firestore by js/firebase-content.js as
   soon as js/firebase-config.js has real values — see
   admin/FIREBASE-SETUP.md to connect a real Firebase project. Until
   then, the site keeps working with the built-in demo content. */
let MEMBERS = [];
let NEWS = NEWS_SEED.slice();
let EVENTS = EVENTS_SEED.slice();
let GALLERY = GALLERY_SEED.map((seed) => ({ id: seed, src: seed }));

function nextMemberId() {
  const year = new Date().getFullYear();
  // Timestamp-based suffix instead of MEMBERS.length, so two people
  // registering at the same moment (from different browsers) don't get
  // the same ID — MEMBERS.length isn't a safe counter once data comes
  // from Firestore instead of a single local array.
  return `MCRSG-${year}-${String(Date.now()).slice(-6)}`;
}

const REGISTER_FIELDS = [
  ["name", { bn: "নাম", en: "Name" }], ["studentId", { bn: "স্টুডেন্ট আইডি", en: "Student ID" }], ["department", { bn: "বিভাগ / শ্রেণি", en: "Department / Class" }],
  ["session", { bn: "সেশন / বর্ষ", en: "Session / Year" }], ["dob", { bn: "জন্ম তারিখ", en: "Date of Birth" }], ["institution", { bn: "প্রতিষ্ঠান", en: "Institution" }],
  ["address", { bn: "ঠিকানা", en: "Address" }], ["phone", { bn: "ফোন", en: "Phone" }], ["email", { bn: "ইমেইল", en: "Email" }],
  ["blood", { bn: "রক্তের গ্রুপ", en: "Blood Group" }], ["emergency", { bn: "জরুরি যোগাযোগ", en: "Emergency Contact" }],
];

function buildSearchIndex() {
  const index = [];
  NAV_GROUPS.forEach((g) => g.items.forEach((item) => {
    index.push({ page: item.id, icon: item.icon, kind: { bn: "পাতা", en: "Page" }, label: item.label });
  }));
  NEWS.forEach((n) => index.push({ page: "news", icon: "message-square", kind: { bn: "সংবাদ", en: "News" }, label: n.title }));
  EVENTS.forEach((e) => index.push({ page: "events", icon: "calendar", kind: { bn: "কার্যক্রম", en: "Activity" }, label: e.title }));
  DOWNLOADS.forEach((d) => index.push({ page: "downloads", icon: "file-text", kind: { bn: "ডাউনলোড", en: "Download" }, label: d.name }));
  LEADERSHIP.forEach((l) => index.push({ page: "leadership", icon: l.icon, kind: { bn: "নেতৃত্ব", en: "Leadership" }, label: { bn: l.name, en: l.name } }));
  return index;
}
const SEARCH_INDEX = buildSearchIndex();

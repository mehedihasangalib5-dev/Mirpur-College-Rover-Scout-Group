/* ---------------------------------------------------------
   DATA.JS — i18n dictionary, roles/permissions, and seed data
   (Ported 1:1 from the original React app's shared/adminCommon.jsx)
--------------------------------------------------------- */

function L(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.bn || obj.en || "";
}

const T = {
  appName: { bn: "অ্যাডমিন প্যানেল", en: "Admin Panel" },
  orgTag: { bn: "NATIONAL SCOUT ORGANIZATION", en: "NATIONAL SCOUT ORGANIZATION" },
  toggleTheme: { bn: "থিম পরিবর্তন করুন", en: "Toggle theme" },
  toggleLang: { bn: "EN", en: "বাং" },
  logout: { bn: "লগ আউট", en: "Log Out" },
  loggedInAs: { bn: "লগইনকৃত", en: "Logged in as" },
  noPermission: { bn: "অনুমতি নেই", en: "No Permission" },
  noPermissionSub: { bn: 'আপনার রোলে "{feature}" ফিচারে প্রবেশাধিকার নেই।', en: 'Your role does not have access to the "{feature}" feature.' },

  loginTitle: { bn: "অ্যাডমিন প্যানেল", en: "Admin Panel" },
  identifierLabel: { bn: "ইমেইল", en: "Email" },
  passwordLabel: { bn: "পাসওয়ার্ড", en: "Password" },
  loginBtn: { bn: "লগইন করুন", en: "Log In" },
  loginBtnLoading: { bn: "লগইন হচ্ছে...", en: "Logging in..." },
  loginHint: { bn: "Firebase Authentication দিয়ে সুরক্ষিত। শুধুমাত্র যেসব ইমেইল অ্যাডমিন হিসেবে নিবন্ধিত, সেগুলো দিয়েই লগইন করা যাবে।", en: "Secured with Firebase Authentication. Only emails registered as admins can log in." },
  loadingAuth: { bn: "সেশন যাচাই করা হচ্ছে...", en: "Checking your session..." },
  errFill: { bn: "ইমেইল ও পাসওয়ার্ড দিন।", en: "Enter your email and password." },
  errInvalidEmail: { bn: "সঠিক ইমেইল ঠিকানা দিন।", en: "Enter a valid email address." },
  errInvalidCredential: { bn: "ইমেইল অথবা পাসওয়ার্ড ভুল।", en: "Incorrect email or password." },
  errTooManyRequests: { bn: "অনেকবার ভুল চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।", en: "Too many failed attempts. Please try again later." },
  errUserDisabled: { bn: "এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।", en: "This account has been disabled." },
  errNetwork: { bn: "নেটওয়ার্ক সমস্যা — ইন্টারনেট সংযোগ পরীক্ষা করুন।", en: "Network error — please check your internet connection." },
  errNotAdmin: { bn: "এই অ্যাকাউন্টটি অ্যাডমিন হিসেবে নিবন্ধিত নয়। একজন সুপার অ্যাডমিনকে আপনার ইমেইল যোগ করতে বলুন।", en: "This account isn't registered as an admin. Ask a Super Admin to add your email." },
  errGeneric: { bn: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।", en: "Something went wrong. Please try again." },

  role_superadmin: { bn: "সুপার অ্যাডমিন", en: "Super Admin" },
  role_leader: { bn: "লিডার (অ্যাডমিন)", en: "Leader (Admin)" },
  role_editor: { bn: "এডিটর", en: "Editor" },

  groupGeneral: { bn: "সাধারণ", en: "General" },
  groupSuperadmin: { bn: "সুপার অ্যাডমিন", en: "Super Admin" },

  m_dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  m_analytics: { bn: "অ্যানালিটিক্স", en: "Analytics" },
  m_members: { bn: "সদস্য", en: "Members" },
  m_registrations: { bn: "আবেদন অনুমোদন", en: "Applications" },
  m_events: { bn: "ইভেন্ট", en: "Events" },
  m_gallery: { bn: "গ্যালারি", en: "Gallery" },
  m_notices: { bn: "নোটিশ / নিউজ", en: "Notices / News" },
  m_certificates: { bn: "সার্টিফিকেট", en: "Certificates" },
  m_qrcodes: { bn: "QR কোড ও উপস্থিতি", en: "QR Codes & Attendance" },
  m_email: { bn: "ইমেইল প্রেরণ", en: "Send Email" },
  m_pushsettings: { bn: "পুশ নোটিফিকেশন", en: "Push Notifications" },
  m_exporttools: { bn: "এক্সপোর্ট / ব্যাকআপ", en: "Export / Backup" },
  m_auditlog: { bn: "অ্যাক্টিভিটি লগ", en: "Activity Log" },
  m_users: { bn: "ইউজার ম্যানেজমেন্ট", en: "User Management" },
  m_permissions: { bn: "পারমিশন ম্যানেজমেন্ট", en: "Permission Management" },
  m_roles: { bn: "রোল ম্যানেজমেন্ট", en: "Role Management" },
  m_settings: { bn: "ওয়েবসাইট সেটিংস", en: "Website Settings" },

  add: { bn: "যোগ করুন", en: "Add" },
  edit: { bn: "সম্পাদনা", en: "Edit" },
  delete: { bn: "মুছুন", en: "Delete" },
  approve: { bn: "অনুমোদন", en: "Approve" },
  reject: { bn: "বাতিল", en: "Reject" },
  send: { bn: "পাঠান", en: "Send" },
  download: { bn: "ডাউনলোড", en: "Download" },
  upload: { bn: "আপলোড করুন", en: "Upload" },
  generate: { bn: "তৈরি করুন", en: "Generate" },
  copy: { bn: "কপি করুন", en: "Copy" },
  copied: { bn: "কপি হয়েছে!", en: "Copied!" },
  print: { bn: "প্রিন্ট", en: "Print" },
  view: { bn: "দেখুন", en: "View" },
  refresh: { bn: "রিফ্রেশ", en: "Refresh" },
  all: { bn: "সকল", en: "All" },
  filter: { bn: "ফিল্টার", en: "Filter" },
  prev: { bn: "পূর্ববর্তী", en: "Previous" },
  next: { bn: "পরবর্তী", en: "Next" },

  dashSub: { bn: "সংগঠনের সার্বিক চিত্র", en: "An overview of the organization" },
  statMembers: { bn: "মোট সদস্য", en: "Total Members" },
  statEvents: { bn: "মোট ইভেন্ট", en: "Total Events" },
  statAttendance: { bn: "আজকের উপস্থিতি", en: "Today's Attendance" },
  statPending: { bn: "মুলতুবি আবেদন", en: "Pending Applications" },
  statCerts: { bn: "সার্টিফিকেট তৈরি", en: "Certificates Generated" },

  membersSub: { bn: "যোগ, সম্পাদনা ও মুছে ফেলা যাবে", en: "Add, edit, and remove members" },
  membersSubReadonly: { bn: "শুধুমাত্র দেখার অনুমতি", en: "View-only access" },
  colScoutId: { bn: "স্কাউট আইডি", en: "Scout ID" },
  colName: { bn: "নাম", en: "Name" },
  colInstitution: { bn: "প্রতিষ্ঠান", en: "Institution" },
  colRank: { bn: "র‍্যাংক", en: "Rank" },
  colAction: { bn: "অ্যাকশন", en: "Action" },
  newMemberName: { bn: "নতুন সদস্যের নাম", en: "New member's name" },

  regSub: { bn: "নতুন সদস্যপদের আবেদন যাচাই করুন", en: "Review new membership applications" },
  regEmpty: { bn: "কোনো মুলতুবি আবেদন নেই।", en: "No pending applications." },
  appliedOn: { bn: "আবেদন", en: "Applied" },

  newEventName: { bn: "নতুন ইভেন্টের নাম", en: "New event name" },

  uploadNewPhoto: { bn: "নতুন ছবি আপলোড করুন", en: "Upload a new photo" },

  noticeTitleLabel: { bn: "নোটিশের শিরোনাম", en: "Notice title" },
  publish: { bn: "প্রকাশ করুন", en: "Publish" },
  today: { bn: "আজ", en: "Today" },

  certSelectMember: { bn: "সদস্য নির্বাচন করুন", en: "Select member" },
  certSelectPlaceholder: { bn: "— নির্বাচন করুন —", en: "— Select —" },
  certTitleLabel: { bn: "সার্টিফিকেটের শিরোনাম", en: "Certificate title" },
  certTitlePlaceholder: { bn: "যেমন: বার্ষিক ক্যাম্প অংশগ্রহণ সনদ", en: "e.g. Annual Camp Participation" },
  certTypeLabel: { bn: "ধরন", en: "Type" },
  certType_participation: { bn: "অংশগ্রহণ", en: "Participation" },
  certType_completion: { bn: "সমাপনী", en: "Completion" },
  certType_appreciation: { bn: "প্রশংসাপত্র", en: "Appreciation" },
  certType_badge: { bn: "ব্যাজ অর্জন", en: "Badge Award" },
  certDateLabel: { bn: "প্রদানের তারিখ", en: "Issue date" },
  certGenerateBtn: { bn: "সার্টিফিকেট তৈরি করুন", en: "Generate Certificate" },
  certGenerated: { bn: "সফলভাবে সার্টিফিকেট তৈরি হয়েছে", en: "Certificate generated successfully" },
  certVerifyCode: { bn: "যাচাই কোড", en: "Verification Code" },
  certIssuedList: { bn: "ইস্যুকৃত সার্টিফিকেট", en: "Issued Certificates" },
  colType: { bn: "ধরন", en: "Type" },
  colDate: { bn: "তারিখ", en: "Date" },
  colVerifyCode: { bn: "যাচাই কোড", en: "Verify Code" },

  qrSub: { bn: "সদস্য নির্বাচন করে QR কোড তৈরি করুন — উপস্থিতি স্ক্যানের জন্য ব্যবহার হবে", en: "Select members and generate QR codes for attendance scanning" },
  qrSelectMembers: { bn: "সদস্য নির্বাচন করুন", en: "Select members" },
  qrGenerateSelected: { bn: "নির্বাচিতদের QR তৈরি করুন", en: "Generate QR for selected" },
  qrGenerateOne: { bn: "QR তৈরি করুন", en: "Generate QR" },
  qrPreviewNote: { bn: "প্রিভিউ — প্রকৃত স্ক্যানযোগ্য কোডটি সার্ভার থেকে তৈরি হয়", en: "Preview only — the real scannable code is rendered server-side" },
  qrEmpty: { bn: "কোনো সদস্য নির্বাচন করা হয়নি।", en: "No members selected yet." },
  qrCardsTitle: { bn: "তৈরিকৃত আইডি কার্ড", en: "Generated ID Cards" },

  analyticsSub: { bn: "সদস্য, উপস্থিতি ও কার্যক্রমের বিশ্লেষণ", en: "Insight into members, attendance, and activity" },
  statActive: { bn: "সক্রিয় সদস্য", en: "Active Members" },
  statUpcoming: { bn: "আসন্ন ইভেন্ট", en: "Upcoming Events" },
  chartMembersGrowth: { bn: "সদস্য বৃদ্ধি (গত ১২ মাস)", en: "Member Growth (last 12 months)" },
  chartAttendance: { bn: "উপস্থিতির হার (গত ৩০ দিন)", en: "Attendance Rate (last 30 days)" },
  chartGender: { bn: "লিঙ্গভিত্তিক বিভাজন", en: "Gender Breakdown" },
  chartInstitutions: { bn: "শীর্ষ প্রতিষ্ঠান", en: "Top Institutions" },
  recentRegs: { bn: "সাম্প্রতিক নিবন্ধন", en: "Recent Registrations" },
  colStatus: { bn: "অবস্থা", en: "Status" },
  genMale: { bn: "ছেলে", en: "Male" },
  genFemale: { bn: "মেয়ে", en: "Female" },
  genUnspecified: { bn: "অনির্দিষ্ট", en: "Unspecified" },

  auditSub: { bn: "সিস্টেমের নিরাপত্তা-সংক্রান্ত কার্যক্রমের রেকর্ড", en: "A record of security-relevant activity across the system" },
  colTime: { bn: "সময়", en: "Time" },
  colUser: { bn: "ইউজার", en: "User" },
  colActionCol: { bn: "অ্যাকশন", en: "Action" },
  colTarget: { bn: "টার্গেট", en: "Target" },
  colIp: { bn: "আইপি", en: "IP" },
  colDetails: { bn: "বিস্তারিত", en: "Details" },
  filterByAction: { bn: "অ্যাকশন অনুযায়ী ফিল্টার", en: "Filter by action" },
  auditEmpty: { bn: "কোনো লগ পাওয়া যায়নি।", en: "No log entries found." },

  pushSub: { bn: "ব্রাউজার পুশ নোটিফিকেশন সাবস্ক্রিপশন ও বার্তা প্রেরণ পরিচালনা করুন", en: "Manage browser push subscriptions and send alerts" },
  pushThisDevice: { bn: "এই ডিভাইসে পুশ নোটিফিকেশন", en: "Push notifications on this device" },
  pushSubscribed: { bn: "সাবস্ক্রাইব করা আছে", en: "Subscribed" },
  pushUnsubscribed: { bn: "সাবস্ক্রাইব করা নেই", en: "Not subscribed" },
  pushSubscribeBtn: { bn: "সাবস্ক্রাইব করুন", en: "Subscribe" },
  pushUnsubscribeBtn: { bn: "আনসাবস্ক্রাইব করুন", en: "Unsubscribe" },
  pushCompose: { bn: "নতুন বার্তা পাঠান", en: "Compose a new alert" },
  pushRecipient: { bn: "প্রাপক", en: "Recipient" },
  pushRecipientAll: { bn: "সকল সদস্য (ব্রডকাস্ট)", en: "All members (broadcast)" },
  pushTitleLabel: { bn: "শিরোনাম", en: "Title" },
  pushMessageLabel: { bn: "বার্তা", en: "Message" },
  pushSent: { bn: "পাঠানো হয়েছে", en: "Sent to" },
  pushDevices: { bn: "টি ডিভাইসে", en: "device(s)" },
  pushRecent: { bn: "সাম্প্রতিক নোটিফিকেশন", en: "Recent Notifications" },
  markRead: { bn: "পঠিত হিসেবে চিহ্নিত করুন", en: "Mark as read" },
  read: { bn: "পঠিত", en: "Read" },
  unread: { bn: "অপঠিত", en: "Unread" },

  exportExcel: { bn: "এক্সেল এক্সপোর্ট করুন", en: "Export to Excel" },
  exportBackup: { bn: "ডেটাবেস ব্যাকআপ নিন", en: "Take a database backup" },

  emailRecipientPh: { bn: "প্রাপক (সকল সদস্য / নির্দিষ্ট গ্রুপ)", en: "Recipient (all members / a specific group)" },
  emailSubjectPh: { bn: "বিষয়", en: "Subject" },
  emailMessagePh: { bn: "বার্তা লিখুন", en: "Write your message" },
  emailSentMsg: { bn: "ইমেইল পাঠানো হয়েছে", en: "Email sent" },

  usersSub: { bn: "অ্যাডমিন অ্যাকাউন্ট ও রোল নিয়ন্ত্রণ", en: "Manage admin accounts and roles" },
  colRole: { bn: "রোল", en: "Role" },
  changeRole: { bn: "রোল পরিবর্তন", en: "Change role" },

  inviteAdminTitle: { bn: "নতুন অ্যাডমিন (লিডার) যোগ করুন", en: "Add a new Admin (Leader)" },
  inviteSuperAdminTitle: { bn: "আরেকজন সুপার অ্যাডমিন যোগ করুন", en: "Add another Super Admin" },
  inviteSuperAdminSub: { bn: "এখানে ইমেইল যোগ করলে Firestore-এ সেই ইমেইলের জন্য \"সুপার অ্যাডমিন\" রোল সংরক্ষিত হবে। তবে লগইন করতে হলে এই ইমেইল দিয়ে একটি Firebase Authentication অ্যাকাউন্টও থাকতে হবে (Firebase Console থেকে তৈরি করুন)।", en: "Adding an email here saves the \"Super Admin\" role for that email in Firestore. To actually log in, a Firebase Authentication account with this same email must also exist (create it from the Firebase Console)." },
  noInvitedSuperAdmins: { bn: "শুধু আপনার ইমেইলটাই সুপার অ্যাডমিন হিসেবে যুক্ত আছে।", en: "Only your email is currently added as Super Admin." },
  inviteAdminSub: { bn: "এখানে ইমেইল যোগ করলে Firestore-এ সেই ইমেইলের জন্য \"লিডার (অ্যাডমিন)\" রোল সংরক্ষিত হবে। লগইন করতে হলে এই ইমেইল দিয়ে একটি Firebase Authentication অ্যাকাউন্টও থাকতে হবে।", en: "Adding an email here saves the \"Leader (Admin)\" role for that email in Firestore. A Firebase Authentication account with this same email must also exist to log in." },
  inviteEditorTitle: { bn: "নতুন এডিটর যোগ করুন", en: "Add a new Editor" },
  inviteEditorSub: { bn: "এখানে ইমেইল যোগ করলে Firestore-এ সেই ইমেইলের জন্য \"এডিটর\" রোল সংরক্ষিত হবে। লগইন করতে হলে এই ইমেইল দিয়ে একটি Firebase Authentication অ্যাকাউন্টও থাকতে হবে।", en: "Adding an email here saves the \"Editor\" role for that email in Firestore. A Firebase Authentication account with this same email must also exist to log in." },
  inviteEmailPh: { bn: "ইমেইল ঠিকানা লিখুন", en: "Enter email address" },
  inviteBtn: { bn: "যোগ করুন", en: "Add" },
  inviteErrEmpty: { bn: "একটি ইমেইল ঠিকানা লিখুন।", en: "Please enter an email address." },
  inviteErrDup: { bn: "এই ইমেইলটি ইতিমধ্যে যুক্ত আছে।", en: "This email has already been added." },
  invitedAdminsListTitle: { bn: "আনলককৃত অ্যাডমিন ইমেইল", en: "Unlocked Admin Emails" },
  invitedEditorsListTitle: { bn: "আনলককৃত এডিটর ইমেইল", en: "Unlocked Editor Emails" },
  noInvitedAdmins: { bn: "এখনো কোনো অ্যাডমিন যুক্ত করা হয়নি — লিডার লগইন লক করা আছে।", en: "No admins added yet — Leader login is locked." },
  noInvitedEditors: { bn: "এখনো কোনো এডিটর যুক্ত করা হয়নি — এডিটর লগইন লক করা আছে।", en: "No editors added yet — Editor login is locked." },
  revoke: { bn: "প্রত্যাহার", en: "Revoke" },
  unlocked: { bn: "আনলক", en: "Unlocked" },
  colEmail: { bn: "ইমেইল", en: "Email" },
  colAddedBy: { bn: "যুক্ত করেছেন", en: "Added by" },
  permsSub: { bn: "Editor রোলের অনুমতি তালিকা", en: "Permission list for the Editor role" },
  colFeature: { bn: "ফিচার", en: "Feature" },
  colPermission: { bn: "পারমিশন", en: "Permission" },
  allowed: { bn: "✔ অনুমোদিত", en: "✔ Allowed" },
  denied: { bn: "✘ নিষিদ্ধ", en: "✘ Denied" },
  featuresAccess: { bn: "টি ফিচারে প্রবেশাধিকার", en: "features accessible" },

  themeControl: { bn: "থিম নিয়ন্ত্রণ", en: "Theme Control" },
  logoChange: { bn: "লোগো / ব্যানার পরিবর্তন", en: "Change Logo / Banner" },
  generalInfo: { bn: "সাধারণ তথ্য", en: "General Info" },
  siteNamePh: { bn: "ওয়েবসাইটের নাম", en: "Website name" },
  contactEmailPh: { bn: "যোগাযোগ ইমেইল", en: "Contact email" },
};

const ROLE_LABEL_KEY = { superadmin: "role_superadmin", leader: "role_leader", editor: "role_editor" };

const PERMISSIONS = {
  superadmin: new Set(["dashboard","members","registrations","events","gallery","notices","certificates","qrcodes","email","pushsettings","exporttools","auditlog","users","permissions","roles","settings","analytics"]),
  leader: new Set(["dashboard","members","registrations","events","gallery","notices","certificates","qrcodes","email","pushsettings","exporttools","analytics","users"]),
  editor: new Set(["dashboard","notices","gallery","events_create","files","messages","members_view","qrcodes"]),
};

function can(role, key) { return PERMISSIONS[role] && PERMISSIONS[role].has(key); }

/* ---------------- seed data ---------------- */

const SEED_MEMBERS = [
  { id: "MCRSG-1187", name: "তানভীর আহমেদ", inst: "মিরপুর কলেজ", rank: "রোভার মেট" },
  { id: "MCRSG-1188", name: "সুমাইয়া রহমান", inst: "মিরপুর কলেজ", rank: "রোভার স্কাউট" },
  { id: "MCRSG-1189", name: "রাকিব হাসান", inst: "মিরপুর কলেজ", rank: "রোভার স্কোয়ার" },
];

const SEED_APPLICATIONS = [
  { id: 1, name: "মেহেদী হাসান", inst: "রাজউক কলেজ", date: "১৮ জুলাই, ২০২৬" },
  { id: 2, name: "নুসরাত জাহান", inst: "হলিক্রস কলেজ", date: "২০ জুলাই, ২০২৬" },
];

const SEED_NOTICES = [
  { id: 1, title: "বার্ষিক সাধারণ সভার নোটিশ", date: "২১ জুলাই, ২০২৬" },
];

const SEED_CERTIFICATES = [
  { id: 1, member: "তানভীর আহমেদ", title: "বার্ষিক ক্যাম্প অংশগ্রহণ সনদ", type: "participation", date: "১০ জুলাই, ২০২৬", code: "a19f2c7db1e04f6a" },
  { id: 2, member: "সুমাইয়া রহমান", title: "নেতৃত্ব প্রশিক্ষণ সমাপনী সনদ", type: "completion", date: "০২ জুলাই, ২০২৬", code: "77e0b453cf2a19d8" },
];

const SEED_MEMBERS_OVER_TIME = [
  { month: "আগ", count: 6 }, { month: "সেপ্ট", count: 9 }, { month: "অক্টো", count: 7 },
  { month: "নভে", count: 12 }, { month: "ডিসে", count: 10 }, { month: "জানু", count: 14 },
  { month: "ফেব্রু", count: 11 }, { month: "মার্চ", count: 16 }, { month: "এপ্রিল", count: 13 },
  { month: "মে", count: 18 }, { month: "জুন", count: 15 }, { month: "জুলাই", count: 20 },
];

const SEED_ATTENDANCE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  rate: 68 + Math.round(28 * Math.abs(Math.sin(i / 3.4)) + (i % 5) * 1.2),
}));

const SEED_GENDER = [
  { key: "genMale", count: 78 }, { key: "genFemale", count: 46 }, { key: "genUnspecified", count: 4 },
];

const SEED_TOP_INSTITUTIONS = [
  { name: "ঢাকা কলেজ", count: 22 }, { name: "নটরডেম কলেজ", count: 18 },
  { name: "ভিকারুননিসা স্কুল", count: 15 }, { name: "রাজউক কলেজ", count: 11 }, { name: "হলিক্রস কলেজ", count: 9 },
];

const SEED_RECENT_REGS = [
  { name: "মেহেদী হাসান", scoutId: "MCRSG-2026-4471", status: "pending", date: "১৮ জুলাই, ২০২৬" },
  { name: "নুসরাত জাহান", scoutId: "MCRSG-2026-4472", status: "pending", date: "২০ জুলাই, ২০২৬" },
  { name: "তানভীর আহমেদ", scoutId: "MCRSG-1187", status: "active", date: "০৩ জুলাই, ২০২৬" },
];

const SEED_AUDIT_LOG = [
  { id: 1, user: "রফিকুল ইসলাম", action: "login_success", target: "—", ip: "103.94.21.10", time: "২৩ জুলাই, ২০২৬ ০৯:১২", details: "{}" },
  { id: 2, user: "কামরুল হাসান", action: "member_added", target: "member #1189", ip: "103.94.21.44", time: "২২ জুলাই, ২০২৬ ১৮:০৩", details: '{"name":"রাকিব হাসান"}' },
  { id: 3, user: "—", action: "login_failed", target: "—", ip: "45.132.9.201", time: "২২ জুলাই, ২০২৬ ১৪:২১", details: '{"reason":"bad_role_key"}' },
  { id: 4, user: "রফিকুল ইসলাম", action: "certificate_issued", target: "certificate #2", ip: "103.94.21.10", time: "০২ জুলাই, ২০২৬ ১১:৪০", details: '{"member_id":"MCRSG-1188"}' },
  { id: 5, user: "রফিকুল ইসলাম", action: "permission_changed", target: "role editor", ip: "103.94.21.10", time: "২৯ জুন, ২০২৬ ১৬:৫৫", details: '{"feature":"delete_member","value":false}' },
  { id: 6, user: "ফারজানা ইয়াসমিন", action: "notice_published", target: "notice #1", ip: "103.94.31.18", time: "২১ জুলাই, ২০২৬ ১০:০৫", details: "{}" },
];

const SEED_NOTIFICATIONS = [
  { id: 1, title: "বার্ষিক ক্যাম্পের রেজিস্ট্রেশন খোলা হয়েছে", body: "সকল সদস্যকে যোগ দেওয়ার আহ্বান জানানো হচ্ছে।", read: false, time: "২১ জুলাই, ২০২৬" },
  { id: 2, title: "নতুন সার্টিফিকেট ইস্যু হয়েছে", body: "সুমাইয়া রহমানের জন্য একটি সার্টিফিকেট তৈরি হয়েছে।", read: true, time: "০২ জুলাই, ২০২৬" },
];

const ACTION_TAG = {
  login_success: "ok", login_failed: "danger", member_added: "info", member_deleted: "danger",
  certificate_issued: "ok", permission_changed: "info", notice_published: "info",
};

/* ---------------- QR-like mosaic preview + helpers ---------------- */

function hashStr(str) {
  let h = 0;
  str = str || "";
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function qrMatrix(text, size = 21) {
  const h = hashStr(text || "MCRSG");
  const rows = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const inFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
      if (inFinder) { row.push(false); continue; }
      const seed = (h ^ ((r + 1) * 928371 + (c + 1) * 68111)) >>> 0;
      row.push(seed % 5 < 2);
    }
    rows.push(row);
  }
  return rows;
}

function qrCodeSvg(value, size = 132) {
  const modules = 21;
  const cell = size / modules;
  const grid = qrMatrix(value, modules);
  function finder(fx, fy) {
    return `<rect x="${fx * cell}" y="${fy * cell}" width="${cell * 7}" height="${cell * 7}" fill="#1F2937" />
      <rect x="${(fx + 1) * cell}" y="${(fy + 1) * cell}" width="${cell * 5}" height="${cell * 5}" fill="#fff" />
      <rect x="${(fx + 2) * cell}" y="${(fy + 2) * cell}" width="${cell * 3}" height="${cell * 3}" fill="#1F2937" />`;
  }
  let cells = "";
  grid.forEach((row, r) => row.forEach((on, c) => {
    if (on) cells += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#1F2937" />`;
  }));
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR ${value}">
      <rect width="${size}" height="${size}" fill="#fff" />
      ${cells}
      ${finder(0, 0)}
      ${finder(modules - 7, 0)}
      ${finder(0, modules - 7)}
    </svg>`;
}

/* small pure-SVG charts — no extra dependency needed */

function miniBarChart(data, labelKey, valueKey, height = 170) {
  const width = 620;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const barW = width / data.length;
  let bars = "";
  data.forEach((d, i) => {
    const h = (d[valueKey] / max) * (height - 28);
    bars += `<rect x="${i * barW + barW * 0.22}" y="${height - 24 - h}" width="${barW * 0.56}" height="${h}" rx="3" fill="var(--ember)" />
      <text x="${i * barW + barW / 2}" y="${height - 8}" text-anchor="middle" font-size="10" fill="var(--rope)">${d[labelKey]}</text>`;
  });
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}

function miniLineChart(data, valueKey, height = 150) {
  const width = 620;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const min = Math.min(...data.map(d => d[valueKey]), 0);
  const stepX = width / ((data.length - 1) || 1);
  const norm = (v) => height - 20 - ((v - min) / (max - min || 1)) * (height - 36);
  const points = data.map((d, i) => `${i * stepX},${norm(d[valueKey])}`).join(" ");
  let dots = "";
  data.forEach((d, i) => { if (i % 4 === 0) dots += `<circle cx="${i * stepX}" cy="${norm(d[valueKey])}" r="2.5" fill="var(--ember)" />`; });
  return `<svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
    <polyline points="${points}" fill="none" stroke="var(--forest-deep)" stroke-width="2.5" />${dots}</svg>`;
}

function hBarList(items, labelKey, valueKey) {
  const max = Math.max(...items.map(i => i[valueKey]), 1);
  return `<div class="flex flex-col gap-3">
    ${items.map(it => `
      <div>
        <div class="flex justify-between text-xs text-rope mb-1"><span>${it[labelKey]}</span><span>${it[valueKey]}</span></div>
        <div class="progress-track h-2"><div class="h-full rounded-full bg-ember" style="width:${(it[valueKey] / max) * 100}%"></div></div>
      </div>`).join("")}
  </div>`;
}

/* ---------------- sidebar menu config ---------------- */

const MENU = [
  { group: "groupGeneral", items: [
    { id: "dashboard", labelKey: "m_dashboard", icon: "layout-dashboard", perm: "dashboard" },
    { id: "analytics", labelKey: "m_analytics", icon: "bar-chart-3", perm: "analytics" },
    { id: "members", labelKey: "m_members", icon: "users", perm: "members", altPerm: "members_view" },
    { id: "registrations", labelKey: "m_registrations", icon: "user-plus", perm: "registrations" },
    { id: "events", labelKey: "m_events", icon: "calendar", perm: "events", altPerm: "events_create" },
    { id: "gallery", labelKey: "m_gallery", icon: "image", perm: "gallery" },
    { id: "notices", labelKey: "m_notices", icon: "bell", perm: "notices" },
    { id: "certificates", labelKey: "m_certificates", icon: "award", perm: "certificates" },
    { id: "qrcodes", labelKey: "m_qrcodes", icon: "scan-line", perm: "qrcodes" },
    { id: "email", labelKey: "m_email", icon: "mail", perm: "email" },
    { id: "pushsettings", labelKey: "m_pushsettings", icon: "bell-ring", perm: "pushsettings" },
    { id: "exporttools", labelKey: "m_exporttools", icon: "file-spreadsheet", perm: "exporttools" },
  ]},
  { group: "groupSuperadmin", items: [
    { id: "auditlog", labelKey: "m_auditlog", icon: "history", perm: "auditlog" },
    { id: "users", labelKey: "m_users", icon: "user-cog", perm: "users" },
    { id: "permissions", labelKey: "m_permissions", icon: "shield-check", perm: "permissions" },
    { id: "roles", labelKey: "m_roles", icon: "clipboard-list", perm: "roles" },
    { id: "settings", labelKey: "m_settings", icon: "settings", perm: "settings" },
  ]},
];

const EDITOR_PERMISSION_TABLE = [
  ["Publish News", true], ["Edit News", true], ["Manage Gallery", true], ["Create Events", true],
  ["Upload Files", true], ["Reply Messages", true], ["View Members", true], ["Generate QR Codes", true],
  ["Edit Members", false], ["Delete Members", false], ["Change Website Settings", false],
  ["Manage Admin Accounts", false], ["Access Database", false],
];

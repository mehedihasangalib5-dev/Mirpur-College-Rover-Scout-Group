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
  appName: { bn: "অ্যাডমিন প্যানেল", en: "Admin Pannel" },
  orgTag: { bn: "মিরপুর কলেজ রোভার স্কাউট গ্রুপ", en: "MIRPUR COLLEGE ROVER SCOUT GROUP" },
  toggleTheme: { bn: "থিম পরিবর্তন করুন", en: "Toggle theme" },
  toggleLang: { bn: "EN", en: "বাং" },
  logout: { bn: "লগ আউট", en: "Log Out" },
  loggedInAs: { bn: "লগইনকৃত", en: "Logged in as" },
  noPermission: { bn: "অনুমতি নেই", en: "No Permission" },
  noPermissionSub: { bn: 'আপনার রোলে "{feature}" ফিচারে প্রবেশাধিকার নেই।', en: 'Your role does not have access to the "{feature}" feature.' },

  loginTitle: { bn: "অ্যাডমিন প্যানেল", en: "Admin Pannel" },
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
  m_email: { bn: "ইমেইল প্রেরণ", en: "Send Email" },
  m_pushsettings: { bn: "পুশ নোটিফিকেশন", en: "Push Notifications" },
  m_exporttools: { bn: "এক্সপোর্ট / ব্যাকআপ", en: "Export / Backup" },
  m_auditlog: { bn: "অ্যাক্টিভিটি লগ", en: "Activity Log" },
  m_users: { bn: "ইউজার ম্যানেজমেন্ট", en: "User Management" },
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

  dashSub: { bn: "মিরপুর কলেজ রোভার স্কাউট গ্রুপের সার্বিক চিত্র", en: "An overview of Mirpur College Rover Scout Group" },
  statMembers: { bn: "মোট সদস্য", en: "Total Members" },
  statEvents: { bn: "মোট ইভেন্ট", en: "Total Events" },
  statNotices: { bn: "প্রকাশিত নোটিশ", en: "Notices Published" },
  statPending: { bn: "মুলতুবি আবেদন", en: "Pending Applications" },

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

  analyticsSub: { bn: "মিরপুর কলেজ রোভার স্কাউট গ্রুপের সদস্য ও কার্যক্রমের বিশ্লেষণ", en: "Insight into Mirpur College Rover Scout Group's members and activity" },
  statUpcoming: { bn: "আসন্ন ইভেন্ট", en: "Upcoming Events" },
  chartMembersGrowth: { bn: "সদস্য বৃদ্ধি (মাসভিত্তিক)", en: "Member Growth (by month)" },
  chartGender: { bn: "লিঙ্গভিত্তিক বিভাজন", en: "Gender Breakdown" },
  chartRankDistribution: { bn: "র‍্যাংকভিত্তিক বিভাজন", en: "Rank Distribution" },
  institutionNote: { bn: "প্রতিষ্ঠান", en: "Institution" },
  institutionNoteBody: { bn: "মিরপুর কলেজ — এই গ্রুপের সকল সদস্যই এই একটি প্রতিষ্ঠানের", en: "Mirpur College — every member of this group belongs to this one institution" },
  recentRegs: { bn: "সাম্প্রতিক নিবন্ধন", en: "Recent Registrations" },
  colStatus: { bn: "অবস্থা", en: "Status" },
  colDate: { bn: "তারিখ", en: "Date" },
  genMale: { bn: "ছেলে", en: "Male" },
  genFemale: { bn: "মেয়ে", en: "Female" },
  genUnspecified: { bn: "অনির্দিষ্ট", en: "Unspecified" },

  auditSub: { bn: "সিস্টেমের নিরাপত্তা-সংক্রান্ত কার্যক্রমের রেকর্ড", en: "A record of security-relevant activity across the system" },
  colTime: { bn: "সময়", en: "Time" },
  colUser: { bn: "ইউজার", en: "User" },
  colActionCol: { bn: "অ্যাকশন", en: "Action" },
  colTarget: { bn: "টার্গেট", en: "Target" },
  colDetails: { bn: "বিস্তারিত", en: "Details" },
  filterByAction: { bn: "অ্যাকশন অনুযায়ী ফিল্টার", en: "Filter by action" },
  auditEmpty: { bn: "কোনো লগ পাওয়া যায়নি।", en: "No log entries found." },
  auditNeedsFirebase: { bn: "প্রকৃত অ্যাক্টিভিটি লগ দেখতে ও রেকর্ড করতে Firebase কনফিগার করা থাকতে হবে (js/firebase-config.js)।", en: "Firebase must be configured (js/firebase-config.js) to record and view the real activity log." },

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
  allowed: { bn: "✔ অনুমোদিত", en: "✔ Allowed" },

  logoChange: { bn: "লোগো / ব্যানার পরিবর্তন", en: "Change Logo / Banner" },
  generalInfo: { bn: "সাধারণ তথ্য", en: "General Info" },
  siteNamePh: { bn: "ওয়েবসাইটের নাম", en: "Website name" },
  contactEmailPh: { bn: "যোগাযোগ ইমেইল", en: "Contact email" },
  save: { bn: "সংরক্ষণ করুন", en: "Save" },
  saving: { bn: "সংরক্ষণ হচ্ছে...", en: "Saving..." },
  sending: { bn: "পাঠানো হচ্ছে...", en: "Sending..." },
  settingsSaved: { bn: "সংরক্ষিত হয়েছে!", en: "Saved!" },
  settingsLocalOnly: { bn: "Firebase কনফিগার করা নেই — পরিবর্তনগুলো শুধু এই ব্রাউজার সেশনে থাকবে, স্থায়ীভাবে সংরক্ষিত হবে না।", en: "Firebase isn't configured — changes will only apply to this browser session and won't be saved permanently." },
};

const ROLE_LABEL_KEY = { superadmin: "role_superadmin", leader: "role_leader", editor: "role_editor" };

const PERMISSIONS = {
  superadmin: new Set(["dashboard","members","registrations","events","gallery","notices","email","pushsettings","exporttools","auditlog","users","settings","analytics"]),
  leader: new Set(["dashboard","members","registrations","events","gallery","notices","email","pushsettings","exporttools","analytics","users"]),
  editor: new Set(["dashboard","notices","gallery","events_create","files","messages","members_view"]),
};

function can(role, key) { return PERMISSIONS[role] && PERMISSIONS[role].has(key); }

function bnNum(n, lang) {
  const s = String(n);
  return lang === "bn" ? s.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : s;
}

/* ---------------- seed data ---------------- */

const SEED_MEMBERS = [];

const SEED_APPLICATIONS = [];

const SEED_NOTICES = [];

const SEED_MEMBERS_OVER_TIME = [];

const SEED_ATTENDANCE_30D = [];

const SEED_GENDER = [];

const SEED_TOP_INSTITUTIONS = [];

const SEED_RECENT_REGS = [];

const SEED_NOTIFICATIONS = [];

const ACTION_TAG = {
  login_success: "ok", login_failed: "danger", logout: "info",
  member_added: "info", member_deleted: "danger",
  application_approved: "ok", application_rejected: "danger",
  event_added: "info", event_deleted: "danger",
  gallery_added: "info", gallery_deleted: "danger",
  notice_published: "info", notice_deleted: "danger",
  push_sent: "info",
  admin_role_granted: "info", admin_role_revoked: "danger",
  settings_updated: "info",
};

function hashStr(str) {
  let h = 0;
  str = str || "";
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
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
    { id: "email", labelKey: "m_email", icon: "mail", perm: "email" },
    { id: "pushsettings", labelKey: "m_pushsettings", icon: "bell-ring", perm: "pushsettings" },
    { id: "exporttools", labelKey: "m_exporttools", icon: "file-spreadsheet", perm: "exporttools" },
  ]},
  { group: "groupSuperadmin", items: [
    { id: "auditlog", labelKey: "m_auditlog", icon: "history", perm: "auditlog" },
    { id: "users", labelKey: "m_users", icon: "user-cog", perm: "users" },
    { id: "settings", labelKey: "m_settings", icon: "settings", perm: "settings" },
  ]},
];

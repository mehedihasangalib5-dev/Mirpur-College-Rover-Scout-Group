/* ---------------------------------------------------------
   FIREBASE-CONTENT.JS
   -----------------------------------------------------------
   This is the fix for: "publish/save/delete করলে সেটা public
   page-এ save বা delete হয় না".

   Root cause it fixes: Members / Events / Gallery / Notices /
   Applications used to live ONLY in the `db`
   object in memory (see app.js) — nothing was ever written to
   a real database, so a refresh (or the public site, which is
   a completely separate page) never saw the change.

   This file wires every one of those admin pages to real
   Firestore collections, using the SAME collection names the
   public site (public/js/firebase-content.js) reads from —
   so Publish/Delete here shows up there immediately, and vice
   versa (new member applications from the public site show up
   here for approval).

   Firestore layout:
     "members"       doc id = Scout ID   { name, inst, rank, ... }
     "applications"  doc id = Scout ID   pending member sign-ups
     "events"        auto id             { title, createdAt }
     "gallery"       auto id             { src, createdAt }
     "notices"       auto id             { title, date, createdAt }

   Falls back to the old local-only (in-memory) behaviour if
   js/firebase-config.js still has placeholder values, so the
   panel keeps working before Firebase is connected.
--------------------------------------------------------- */

const MEMBERS_COLLECTION = "members";
const APPLICATIONS_COLLECTION = "applications";
const EVENTS_COLLECTION = "events";
const GALLERY_COLLECTION = "gallery";
const NOTICES_COLLECTION = "notices";
const ACTIVITY_LOG_COLLECTION = "activityLog";
const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC_ID = "site";

function fbContentReady() {
  return typeof firebase !== "undefined" && typeof firebase.firestore === "function";
}

function contentErr(err) {
  console.error(err);
  alert(state.lang === "bn"
    ? "সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ ও Firestore নিয়ম (rules) পরীক্ষা করুন।\n\n" + (err && err.message ? err.message : err)
    : "Could not save — check your internet connection and Firestore security rules.\n\n" + (err && err.message ? err.message : err));
}

/* ---------------- live listeners ---------------- */

let contentUnsubs = [];
function stopContentListeners() { contentUnsubs.forEach((u) => u && u()); contentUnsubs = []; }

function startContentListeners() {
  if (!fbContentReady()) return; // no firebase-config.js values yet — stay on local seed data
  stopContentListeners();

  contentUnsubs.push(fsDb.collection(MEMBERS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.members = snap.docs.map((d) => ({ ...d.data(), id: d.id })); render(); },
    (err) => console.error("members listener:", err)
  ));

  contentUnsubs.push(fsDb.collection(APPLICATIONS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.applications = snap.docs.map((d) => ({ ...d.data(), id: d.id })); render(); },
    (err) => console.error("applications listener:", err)
  ));

  contentUnsubs.push(fsDb.collection(EVENTS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.events = snap.docs.map((d) => ({ ...d.data(), id: d.id })); render(); },
    (err) => console.error("events listener:", err)
  ));

  contentUnsubs.push(fsDb.collection(GALLERY_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.gallery = snap.docs.map((d) => ({ ...d.data(), id: d.id })); render(); },
    (err) => console.error("gallery listener:", err)
  ));

  contentUnsubs.push(fsDb.collection(NOTICES_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.notices = snap.docs.map((d) => ({ ...d.data(), id: d.id })); render(); },
    (err) => console.error("notices listener:", err)
  ));

  startActivityLogListener();
  startSettingsListener();
}

/* ---------------- members ---------------- */

function fbAddMember(name) {
  const newId = `MCRSG-${Date.now()}`;
  return fsDb.collection(MEMBERS_COLLECTION).doc(newId).set({
    id: newId, name, inst: "মিরপুর কলেজ", rank: "রোভার স্কোয়ার",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
function fbDeleteMember(id) { return fsDb.collection(MEMBERS_COLLECTION).doc(id).delete(); }

/* ---------------- applications (public registrations) ---------------- */

function fbApproveApplication(app) {
  const { id, ...data } = app;
  return fsDb.collection(MEMBERS_COLLECTION).doc(id).set({
    ...data, id, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).then(() => fsDb.collection(APPLICATIONS_COLLECTION).doc(id).delete());
}
function fbRejectApplication(id) { return fsDb.collection(APPLICATIONS_COLLECTION).doc(id).delete(); }

/* ---------------- events ---------------- */

function fbAddEvent(title) {
  return fsDb.collection(EVENTS_COLLECTION).add({
    title, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
function fbDeleteEvent(id) { return fsDb.collection(EVENTS_COLLECTION).doc(id).delete(); }

/* ---------------- gallery ---------------- */

function fbAddGalleryImage(dataUrl) {
  return fsDb.collection(GALLERY_COLLECTION).add({
    src: dataUrl, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
function fbDeleteGalleryImage(id) { return fsDb.collection(GALLERY_COLLECTION).doc(id).delete(); }

/* ---------------- notices ---------------- */

function fbPublishNotice(title, dateLabel) {
  return fsDb.collection(NOTICES_COLLECTION).add({
    title, date: dateLabel, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
function fbDeleteNotice(id) { return fsDb.collection(NOTICES_COLLECTION).doc(id).delete(); }

/* ---------------- activity log (real, Firestore-backed) ----------------
   Every meaningful admin action (login, logout, add/delete/publish/
   approve/reject, role changes, settings changes) writes one document
   here via logActivity(). The Audit Log page (pagesAuditLog) just
   renders whatever this collection contains live — nothing on that
   page is fake/seed data anymore. Firestore security rules should
   restrict both read and write to `request.auth != null` (see
   FIREBASE-SETUP.md), which is why failed-login attempts before a
   successful sign-in generally can't be written here. */

function logActivity(action, target, details) {
  if (!fbContentReady()) return Promise.resolve();
  const user = (state.session && state.session.identifier) || target || "—";
  return fsDb.collection(ACTIVITY_LOG_COLLECTION).add({
    action, target: target || "", details: details || "", user,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).catch((err) => console.error("activity log write failed:", err));
}

function startActivityLogListener() {
  if (!fbContentReady()) return;
  contentUnsubs.push(fsDb.collection(ACTIVITY_LOG_COLLECTION).orderBy("createdAt", "desc").limit(200).onSnapshot(
    (snap) => {
      db.auditLog = snap.docs.map((d) => {
        const data = d.data();
        const dt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
        return {
          id: d.id,
          time: dt ? dt.toLocaleString(state.lang === "bn" ? "bn-BD" : "en-GB") : "…",
          user: data.user || "—",
          action: data.action || "—",
          target: data.target || "",
          details: data.details || "",
        };
      });
      render();
    },
    (err) => console.error("activity log listener:", err)
  ));
}

/* ---------------- website settings ---------------- */

let settingsLoadedOnce = false;

function fbSaveSettings(fields) {
  return fsDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID).set(
    { ...fields, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

function startSettingsListener() {
  if (!fbContentReady()) return;
  settingsLoadedOnce = false;
  contentUnsubs.push(fsDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID).onSnapshot(
    (doc) => {
      const data = doc.exists ? doc.data() : {};
      db.settings = {
        siteName: data.siteName || db.settings.siteName,
        contactEmail: data.contactEmail || db.settings.contactEmail,
        logoUrl: data.logoUrl || "",
      };
      // only overwrite the editable form fields on the FIRST snapshot,
      // so we don't clobber text the admin is actively typing if the
      // listener happens to fire again mid-edit
      if (!settingsLoadedOnce) {
        db.ui.settingsSiteName = db.settings.siteName;
        db.ui.settingsContactEmail = db.settings.contactEmail;
        settingsLoadedOnce = true;
      }
      render();
    },
    (err) => console.error("settings listener:", err)
  ));
}

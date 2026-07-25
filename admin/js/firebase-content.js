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

/* ---------------------------------------------------------
   FIREBASE-CONTENT.JS (public site)
   -----------------------------------------------------------
   Keeps EVENTS, NEWS and GALLERY live-synced with the exact
   same Firestore collections the admin panel writes to
   (admin/js/firebase-content.js), so Publish/Delete in /admin
   shows up (or disappears) here immediately — this is the
   other half of the fix for "publish/save/delete করলে public
   page-এ reflect হয় না".

   Falls back to the built-in demo content (NEWS_SEED /
   EVENTS_SEED / GALLERY_SEED in js/data.js) until
   js/firebase-config.js has real values.
--------------------------------------------------------- */

const EVENTS_COLLECTION = "events";
const GALLERY_COLLECTION = "gallery";
const NOTICES_COLLECTION = "notices";

function fbContentReady() {
  return typeof firebase !== "undefined" && typeof firebase.firestore === "function";
}

function startEventsListener() {
  if (!fbContentReady()) return; // no firebase-config.js values yet — stay on EVENTS_SEED
  firebase.firestore().collection(EVENTS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { EVENTS = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("events listener error:", err)
  );
}

function startGalleryListener() {
  if (!fbContentReady()) return;
  firebase.firestore().collection(GALLERY_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { GALLERY = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("gallery listener error:", err)
  );
}

function startNoticesListener() {
  if (!fbContentReady()) return;
  firebase.firestore().collection(NOTICES_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { NEWS = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("notices listener error:", err)
  );
}

function galleryImgSrc(item) {
  const src = (item && item.src) || item || "";
  return src.startsWith("data:") || src.startsWith("http") ? src : `https://picsum.photos/seed/${src}/400/300`;
}

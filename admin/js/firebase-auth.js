/* ---------------------------------------------------------
   FIREBASE-AUTH.JS
   -----------------------------------------------------------
   Wires the admin panel up to real Firebase Authentication
   (email/password) for login, and Firestore for role storage
   (who is superadmin / leader / editor).

   Firestore layout:
     collection "admins"
       doc id = the admin's email (lowercased)
       fields = { email, role: "superadmin"|"leader"|"editor", addedBy }

   A Firestore "admins" doc only grants a ROLE — the actual
   Firebase Authentication account (the thing that lets someone
   type in a password and log in) is created separately, either
   from the Firebase Console or via the one-time bootstrap
   described in admin/FIREBASE-SETUP.md.
--------------------------------------------------------- */

const fbAuth = firebase.auth();
const fsDb = firebase.firestore();
const ADMINS_COLLECTION = "admins";

function adminDocId(email) { return normEmail(email); }

/* Firestore listener for the "admins" collection, kept live while
   someone is logged in so the Users page always reflects reality
   and updates instantly after an invite/revoke. */
let adminsUnsub = null;

function startAdminsListener() {
  stopAdminsListener();
  adminsUnsub = fsDb.collection(ADMINS_COLLECTION).onSnapshot(
    (snap) => {
      const superadmins = [], leaders = [], editors = [];
      snap.forEach((doc) => {
        const d = doc.data();
        const row = { email: d.email || doc.id, addedBy: d.addedBy || "" };
        if (d.role === "superadmin") superadmins.push(row);
        else if (d.role === "leader") leaders.push(row);
        else if (d.role === "editor") editors.push(row);
      });
      db.invitedSuperAdmins = superadmins;
      db.invitedAdmins = leaders;
      db.invitedEditors = editors;
      render();
    },
    () => { /* permission-denied etc. — ignore, page just shows empty lists */ }
  );
}

function stopAdminsListener() {
  if (adminsUnsub) { adminsUnsub(); adminsUnsub = null; }
}

/* ---- content collections shared with the public website ----
   members / events / gallery / notices. These used to only live in
   the in-memory `db` object (see app.js), which is why anything an
   admin published/saved/deleted never showed up on the public site
   and disappeared on refresh. Now they're kept live from Firestore,
   the same way admins/roles already were, so:
     - public visitors registering write into "members", and the
       admin Members/Registrations pages read+write that same doc
     - admin Events/Gallery/Notices pages write into their own
       collections, which the public site listens to as well
   See admin/FIREBASE-SETUP.md + public/MEMBER-FIREBASE-SETUP.md for
   the Firestore Security Rules these collections need. */
const MEMBERS_COLLECTION = "members";
const EVENTS_COLLECTION = "events";
const GALLERY_COLLECTION = "gallery";
const NOTICES_COLLECTION = "notices";

let membersUnsub = null, eventsUnsub = null, galleryUnsub = null, noticesUnsub = null;

function startContentListeners() {
  stopContentListeners();
  membersUnsub = fsDb.collection(MEMBERS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.members = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => { console.error("members listener error:", err); /* table just stays empty/seed until rules are set */ }
  );
  eventsUnsub = fsDb.collection(EVENTS_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.events = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("events listener error:", err)
  );
  galleryUnsub = fsDb.collection(GALLERY_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.gallery = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("gallery listener error:", err)
  );
  noticesUnsub = fsDb.collection(NOTICES_COLLECTION).orderBy("createdAt", "desc").onSnapshot(
    (snap) => { db.notices = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })); render(); },
    (err) => console.error("notices listener error:", err)
  );
}

function stopContentListeners() {
  [membersUnsub, eventsUnsub, galleryUnsub, noticesUnsub].forEach((u) => { if (u) u(); });
  membersUnsub = eventsUnsub = galleryUnsub = noticesUnsub = null;
}

async function fetchAdminRoleDoc(email) {
  const snap = await fsDb.collection(ADMINS_COLLECTION).doc(adminDocId(email)).get();
  return snap.exists ? snap.data() : null;
}

function fbErrorMessage(err, lang) {
  const code = err && err.code;
  switch (code) {
    case "auth/invalid-email": return L(T.errInvalidEmail, lang);
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return L(T.errInvalidCredential, lang);
    case "auth/too-many-requests": return L(T.errTooManyRequests, lang);
    case "auth/user-disabled": return L(T.errUserDisabled, lang);
    case "auth/network-request-failed": return L(T.errNetwork, lang);
    default: return L(T.errGeneric, lang);
  }
}

/* ---- login / logout ---- */

async function fbLogin(email, password) {
  await fbAuth.signInWithEmailAndPassword(email, password);
  // onAuthStateChanged (below) picks up the signed-in user, looks up
  // their role in Firestore, and updates state.session + re-renders.
}

async function fbLogout() {
  stopAdminsListener();
  stopContentListeners();
  await fbAuth.signOut();
}

/* ---- invite / revoke: write the role assignment to Firestore.
   Does NOT create a Firebase Auth account — that part is manual
   (see admin/FIREBASE-SETUP.md). ---- */

async function fbSetAdminRole(email, role, addedBy) {
  const id = adminDocId(email);
  await fsDb.collection(ADMINS_COLLECTION).doc(id).set({
    email: normEmail(email), role, addedBy,
  });
}

async function fbRevokeAdminRole(email) {
  await fsDb.collection(ADMINS_COLLECTION).doc(adminDocId(email)).delete();
}

/* ---------------- boot sequence ----------------
   Firebase checks IndexedDB/localStorage for an existing signed-in
   user asynchronously, so the very first render() (triggered at the
   bottom of pages2.js) happens before we know the answer — that's
   why state.authLoading starts true and renderLoadingScreen() covers
   that gap. */

fbAuth.onAuthStateChanged(async (user) => {
  state.authLoading = false;

  if (!user) {
    stopAdminsListener();
    stopContentListeners();
    state.session = null;
    render();
    return;
  }

  const email = normEmail(user.email || "");
  try {
    const roleDoc = await fetchAdminRoleDoc(email);
    if (!roleDoc || !roleDoc.role) {
      state.loginError = L(T.errNotAdmin, state.lang);
      await fbAuth.signOut(); // re-triggers this callback with user = null
      return;
    }
    state.session = { role: roleDoc.role, identifier: email, uid: user.uid };
    state.loginError = "";
    state.page = "dashboard";
    startAdminsListener(); // also calls render() once data arrives
    startContentListeners();
    render();
  } catch (err) {
    state.loginError = L(T.errGeneric, state.lang);
    render();
  }
});

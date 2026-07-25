/* ---------------------------------------------------------
   APP.JS — state, login screen, shell (sidebar/header) and
   page renderers for the National Scout Organization Admin
   Panel. Plain HTML5 / CSS3 / JavaScript (no build step).
--------------------------------------------------------- */

const state = {
  lang: localStorage.getItem("sc_lang") === "en" ? "en" : "bn",
  dark: localStorage.getItem("sc_dark") === "1" ? true : (localStorage.getItem("sc_dark") === "0" ? false : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)),
  session: null,   // { role, identifier, uid } — set by firebase-auth.js after Firebase sign-in + Firestore role lookup
  page: "dashboard",
  loginError: "",
  authLoading: true, // true until Firebase's onAuthStateChanged fires once
  loginSubmitting: false,
};

function normEmail(e) { return (e || "").trim().toLowerCase(); }
function findInvited(list, email) { return list.find(u => u.email === normEmail(email)); }

/* mutable in-memory "database" for this demo admin panel —
   mirrors the useState() arrays in the original React pages.
   invitedSuperAdmins/invitedAdmins/invitedEditors are now kept in
   sync with the Firestore "admins" collection by the onSnapshot
   listener in firebase-auth.js (see startAdminsListener). */
const db = {
  invitedSuperAdmins: [], // [{ email, addedBy }] — role "superadmin" in Firestore
  invitedAdmins: [],      // [{ email, addedBy }] — role "leader" in Firestore
  invitedEditors: [],     // [{ email, addedBy }] — role "editor" in Firestore
  inviteSuperAdminInput: "", inviteSuperAdminError: "",
  inviteAdminInput: "", inviteAdminError: "",
  inviteEditorInput: "", inviteEditorError: "",
  /* members/events/gallery/notices below start out as local seed data
     (so the panel isn't empty before Firestore answers, and still works
     if firebase-config.js hasn't been filled in yet) but get replaced
     with the live Firestore documents the moment startContentListeners()
     (see firebase-auth.js) receives its first snapshot after login —
     that's what makes publish/save/delete on these four pages actually
     persist and show up on the public site. */
  members: SEED_MEMBERS.slice(),
  events: [
    { id: "seed-1", title: "বার্ষিক শীতকালীন ক্যাম্প", date: "", location: "" },
    { id: "seed-2", title: "পাহাড়ি হাইকিং অভিযান", date: "", location: "" },
  ],
  gallery: [
    { id: "seed-1", src: "camp1" }, { id: "seed-2", src: "hike2" }, { id: "seed-3", src: "group3" },
  ],
  notices: SEED_NOTICES.slice(),
  certificates: SEED_CERTIFICATES.slice(),
  qrSelected: [],
  qrGenerated: [],
  pushSubscribed: true,
  notifications: SEED_NOTIFICATIONS.slice(),
  auditFilter: "",
  auditPage: 0,
  ui: { showAddMember: false, newMemberName: "", newEventTitle: "", newEventDate: "", newEventLocation: "", noticeTitle: "", noticeTag: "",
        certMember: "", certTitle: "", certType: "participation", certIssueDate: "",
        justIssued: null, copied: false, emailSent: false,
        pushRecipient: "all", pushTitle: "", pushMessage: "", pushSentInfo: null,
        auditOpenDetails: null },
};

function setLang(l) { state.lang = l; localStorage.setItem("sc_lang", l); render(); }
function setDark(d) { state.dark = d; localStorage.setItem("sc_dark", d ? "1" : "0"); render(); }
function setPage(p) { state.page = p; render(); }

function createIcons() { if (window.lucide) window.lucide.createIcons(); }
function icon(name, opts = "") { return `<i data-lucide="${name}" ${opts}></i>`; }

/* ---------------- login ----------------
   Real authentication now happens in firebase-auth.js: submitLogin()
   below just calls Firebase's signInWithEmailAndPassword. The role
   (superadmin/leader/editor) is looked up from the "admins" Firestore
   collection by firebase-auth.js's onAuthStateChanged handler, which
   sets state.session and re-renders once it knows the answer. */

async function submitLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value;
  const lang = state.lang;

  if (!identifier || !password) {
    state.loginError = L(T.errFill, lang);
    render();
    return;
  }

  state.loginError = "";
  state.loginSubmitting = true;
  render();

  try {
    await fbLogin(identifier, password);
    // success: onAuthStateChanged in firebase-auth.js takes it from here
  } catch (err) {
    state.loginError = fbErrorMessage(err, lang);
  } finally {
    state.loginSubmitting = false;
    render();
  }
}

function logout() {
  fbLogout().catch(() => {});
}

/* ---- invite / revoke (super admin adds admins, admins add editors) ----
   These write a role assignment into Firestore's "admins" collection.
   They do NOT create the Firebase Authentication account itself — see
   admin/FIREBASE-SETUP.md for how to create that from the Console. */

async function addInvitedSuperAdmin() {
  const lang = state.lang;
  const email = normEmail(db.inviteSuperAdminInput);
  if (!email) { db.inviteSuperAdminError = L(T.inviteErrEmpty, lang); render(); return; }
  if (findInvited(db.invitedSuperAdmins, email)) { db.inviteSuperAdminError = L(T.inviteErrDup, lang); render(); return; }
  db.inviteSuperAdminError = "";
  try {
    await fbSetAdminRole(email, "superadmin", state.session.identifier);
    db.inviteSuperAdminInput = "";
  } catch (e) {
    db.inviteSuperAdminError = L(T.errGeneric, lang);
  }
  render();
}

async function revokeInvitedSuperAdmin(email) {
  if (db.invitedSuperAdmins.length <= 1) return; // never allow zero super admins — total lockout
  try { await fbRevokeAdminRole(email); } catch (e) { /* Firestore listener re-renders regardless */ }
}

async function addInvitedAdmin() {
  const lang = state.lang;
  const email = normEmail(db.inviteAdminInput);
  if (!email) { db.inviteAdminError = L(T.inviteErrEmpty, lang); render(); return; }
  if (findInvited(db.invitedAdmins, email)) { db.inviteAdminError = L(T.inviteErrDup, lang); render(); return; }
  db.inviteAdminError = "";
  try {
    await fbSetAdminRole(email, "leader", state.session.identifier);
    db.inviteAdminInput = "";
  } catch (e) {
    db.inviteAdminError = L(T.errGeneric, lang);
  }
  render();
}

async function revokeInvitedAdmin(email) {
  try { await fbRevokeAdminRole(email); } catch (e) { /* no-op */ }
}

async function addInvitedEditor() {
  const lang = state.lang;
  const email = normEmail(db.inviteEditorInput);
  if (!email) { db.inviteEditorError = L(T.inviteErrEmpty, lang); render(); return; }
  if (findInvited(db.invitedEditors, email)) { db.inviteEditorError = L(T.inviteErrDup, lang); render(); return; }
  db.inviteEditorError = "";
  try {
    await fbSetAdminRole(email, "editor", state.session.identifier);
    db.inviteEditorInput = "";
  } catch (e) {
    db.inviteEditorError = L(T.errGeneric, lang);
  }
  render();
}

async function revokeInvitedEditor(email) {
  try { await fbRevokeAdminRole(email); } catch (e) { /* no-op */ }
}

function headerToggles(compact) {
  const lang = state.lang;
  const style = compact ? ' style="border-color:var(--rope);color:var(--forest-deep)"' : "";
  return `
    <div class="flex items-center ${compact ? "gap-1.5" : "gap-2"}">
      <button aria-label="${L(T.toggleTheme, lang)}" onclick="setDark(${!state.dark})" class="icon-btn"${style}>${icon(state.dark ? "sun" : "moon", 'style="width:15px;height:15px"')}</button>
      <button aria-label="${L(T.toggleLang, lang)}" onclick="setLang('${lang === "bn" ? "en" : "bn"}')" class="icon-btn w-auto px-2.5 ap-eyebrow text-[11px]"${style}>${L(T.toggleLang, lang)}</button>
    </div>`;
}

function renderLoadingScreen() {
  const lang = state.lang;
  return `
  <div class="ap-root min-h-screen bg-forest flex items-center justify-center px-4">
    <div class="flex flex-col items-center gap-3 text-cream">
      ${icon("loader-circle", 'style="width:28px;height:28px" class="animate-spin"')}
      <span class="ap-eyebrow text-sm">${L(T.loadingAuth, lang)}</span>
    </div>
  </div>`;
}

function renderLoginScreen() {
  const lang = state.lang;
  return `
  <div class="ap-root min-h-screen bg-forest flex items-center justify-center px-4">
    <div class="card w-full max-w-md p-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          ${icon("compass", 'style="width:34px;height:34px" class="text-ember"')}
          <div>
            <div class="ap-display font-bold text-forest text-lg leading-none">${L(T.loginTitle, lang)}</div>
            <div class="ap-eyebrow text-rope text-xs mt-1">${L(T.orgTag, lang)}</div>
          </div>
        </div>
        ${headerToggles(true)}
      </div>

      <form onsubmit="submitLogin(event)" class="flex flex-col gap-4">
        <div>
          <label class="text-sm text-rope block mb-1">${L(T.identifierLabel, lang)}</label>
          <input id="loginIdentifier" type="email" autocomplete="username" class="input-field" placeholder="you@example.com" ${state.loginSubmitting ? "disabled" : ""} />
        </div>
        <div>
          <label class="text-sm text-rope block mb-1">${L(T.passwordLabel, lang)}</label>
          <input id="loginPassword" type="password" autocomplete="current-password" class="input-field" ${state.loginSubmitting ? "disabled" : ""} />
        </div>

        ${state.loginError ? `<div class="text-danger text-sm flex items-center gap-2">${icon("alert-triangle", 'style="width:16px;height:16px"')}${state.loginError}</div>` : ""}

        <button class="btn-primary mt-2" type="submit" ${state.loginSubmitting ? "disabled" : ""}>${state.loginSubmitting ? L(T.loginBtnLoading, lang) : L(T.loginBtn, lang)}</button>
      </form>

      <p class="text-rope text-xs mt-5 leading-relaxed">${L(T.loginHint, lang)}</p>
    </div>
  </div>`;
}

/* ---------------- shell (sidebar + header) ---------------- */

function hasAccess(item, role) {
  return can(role, item.perm) || (item.altPerm && can(role, item.altPerm));
}

function renderShell() {
  const lang = state.lang;
  const { role, identifier } = state.session;
  const flatMenu = MENU.flatMap(g => g.items);
  const currentItem = flatMenu.find(i => i.id === state.page);
  const currentAllowed = currentItem ? hasAccess(currentItem, role) : true;

  return `
  <div class="ap-root min-h-screen flex">
    <aside class="bg-forest w-64 shrink-0 p-5 hidden md:flex md:flex-col">
      <div class="flex items-center gap-2 mb-8">
        ${icon("compass", 'style="width:28px;height:28px" class="text-ember"')}
        <div>
          <div class="ap-display text-cream font-bold leading-none">${L(T.appName, lang)}</div>
          <div class="ap-eyebrow text-gold text-xs mt-1">${L(T[ROLE_LABEL_KEY[role]], lang)}</div>
        </div>
      </div>
      <div class="flex flex-col gap-6 overflow-y-auto flex-1">
        ${MENU.map(group => {
          const visibleItems = group.items.filter(it => role === "editor" ? hasAccess(it, role) : true);
          if (role === "editor" && visibleItems.length === 0) return "";
          return `
            <div>
              <div class="ap-eyebrow text-gold text-xs mb-2 opacity-70">${L(T[group.group], lang)}</div>
              <div class="flex flex-col gap-1">
                ${visibleItems.map(it => {
                  const allowed = hasAccess(it, role);
                  return `
                    <button ${allowed ? "" : "disabled"} onclick="${allowed ? `setPage('${it.id}')` : ""}" class="sidebar-item ${state.page === it.id ? "active" : ""} ${!allowed ? "locked" : ""}">
                      ${icon(it.icon, 'style="width:16px;height:16px"')}${L(T[it.labelKey], lang)}
                      ${!allowed ? icon("lock", 'style="width:12px;height:12px" class="ml-auto"') : ""}
                    </button>`;
                }).join("")}
              </div>
            </div>`;
        }).join("")}
      </div>
      <a href="../index.html" class="sidebar-item" style="text-decoration:none;">${icon("compass", 'style="width:16px;height:16px"')} ${lang === "bn" ? "ওয়েবসাইটে ফিরুন" : "Back to Website"}</a>
      <button onclick="logout()" class="sidebar-item mt-2">${icon("log-out", 'style="width:16px;height:16px"')} ${L(T.logout, lang)}</button>
    </aside>

    <main class="flex-1">
      <div class="bg-canvas border-b border-rope border-opacity-20 px-6 py-3 flex items-center justify-between">
        <span class="text-rope text-sm">${L(T.loggedInAs, lang)}: <span class="text-forest font-medium">${identifier}</span></span>
        <div class="flex items-center gap-4">
          <span class="ap-eyebrow text-xs text-ember">${L(T[ROLE_LABEL_KEY[role]], lang)}</span>
          ${headerToggles(true)}
        </div>
      </div>
      <div class="p-6 max-w-5xl">
        ${currentAllowed ? (PAGE_RENDERERS[state.page] || PAGE_RENDERERS.dashboard)(role) : renderLockedNotice(currentItem ? L(T[currentItem.labelKey], lang) : state.page)}
      </div>
    </main>
  </div>`;
}

function renderLockedNotice(feature) {
  const lang = state.lang;
  return `
    <div class="card p-8 text-center">
      ${icon("lock", 'style="width:30px;height:30px" class="text-rope mx-auto mb-3"')}
      <h3 class="ap-display font-bold text-forest">${L(T.noPermission, lang)}</h3>
      <p class="text-rope text-sm mt-1">${L(T.noPermissionSub, lang).replace("{feature}", feature)}</p>
    </div>`;
}

function pageHeader(title, sub) {
  const lang = state.lang;
  return `
    <div class="mb-6">
      <h2 class="ap-display text-2xl font-bold text-forest">${L(title, lang)}</h2>
      ${sub ? `<p class="text-rope text-sm mt-1">${L(sub, lang)}</p>` : ""}
    </div>`;
}

function statCard(iconName, label, value) {
  return `
    <div class="card p-5 flex items-center gap-4">
      <div class="bg-forest rounded-lg p-3">${icon(iconName, 'style="width:22px;height:22px" class="text-cream"')}</div>
      <div>
        <div class="ap-display text-2xl font-bold text-forest">${value}</div>
        <div class="text-rope text-sm">${label}</div>
      </div>
    </div>`;
}

/* ---------------- root render ---------------- */

function render() {
  document.documentElement.className = state.dark ? "dark" : "";
  document.documentElement.lang = state.lang;
  const root = document.getElementById("root");
  root.innerHTML = state.authLoading
    ? renderLoadingScreen()
    : (state.session ? renderShell() : renderLoginScreen());
  createIcons();
}

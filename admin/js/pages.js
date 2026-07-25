/* ---------------------------------------------------------
   PAGES.JS — the 16 admin pages, each ported 1:1 from the
   corresponding React component in frontend/Admin/*.jsx
--------------------------------------------------------- */

function pageDashboard() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_dashboard, T.dashSub)}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        ${statCard("users", L(T.statMembers, lang), "১২৮")}
        ${statCard("calendar", L(T.statEvents, lang), "১৪")}
        ${statCard("clipboard-list", L(T.statAttendance, lang), "৯৪")}
        ${statCard("user-plus", L(T.statPending, lang), "২")}
        ${statCard("award", L(T.statCerts, lang), "৩৭")}
      </div>
    </div>`;
}

function pageAnalytics() {
  const lang = state.lang;
  const genderData = SEED_GENDER.map(g => ({ name: L(T[g.key], lang), count: g.count }));
  return `
    <div>
      ${pageHeader(T.m_analytics, T.analyticsSub)}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        ${statCard("users", L(T.statMembers, lang), "১২৮")}
        ${statCard("check-circle-2", L(T.statActive, lang), "১১৮")}
        ${statCard("calendar", L(T.statUpcoming, lang), "৬")}
        ${statCard("award", L(T.statCerts, lang), "৩৭")}
        ${statCard("clipboard-list", L(T.statAttendance, lang), "৯৪%")}
      </div>

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("bar-chart-3", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartMembersGrowth, lang)}</div>
          ${miniBarChart(SEED_MEMBERS_OVER_TIME, "month", "count")}
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("bar-chart-3", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartAttendance, lang)}</div>
          ${miniLineChart(SEED_ATTENDANCE_30D, "rate")}
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("users", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartGender, lang)}</div>
          ${hBarList(genderData, "name", "count")}
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("compass", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartInstitutions, lang)}</div>
          ${hBarList(SEED_TOP_INSTITUTIONS, "name", "count")}
        </div>
      </div>

      ${pageHeader(T.recentRegs)}
      <div class="card overflow-hidden overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-canvas text-forest"><tr>
            <th class="text-left p-3">${L(T.colName, lang)}</th>
            <th class="text-left p-3">${L(T.colScoutId, lang)}</th>
            <th class="text-left p-3">${L(T.colStatus, lang)}</th>
            <th class="text-left p-3">${L(T.colDate, lang)}</th>
          </tr></thead>
          <tbody>
            ${SEED_RECENT_REGS.map(r => `
              <tr class="border-t border-rope border-opacity-20">
                <td class="p-3 text-forest">${r.name}</td>
                <td class="p-3 text-rope">${r.scoutId}</td>
                <td class="p-3">${r.status === "active" ? `<span class="tag-ok">${L(T.allowed, lang).replace("✔ ", "")}</span>` : `<span class="tag-info">${r.status}</span>`}</td>
                <td class="p-3 text-rope">${r.date}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function toggleAddMember() { db.ui.showAddMember = !db.ui.showAddMember; render(); }
function updateNewMemberName(v) { db.ui.newMemberName = v; }

function newMemberId() {
  const year = new Date().getFullYear();
  return `MCRSG-${year}-${String(Date.now()).slice(-6)}`;
}

async function addMember() {
  const name = db.ui.newMemberName.trim();
  if (!name) return;
  const id = newMemberId();
  const member = {
    name, inst: "মিরপুর কলেজ", rank: "রোভার স্কোয়ার", status: "active",
  };
  try {
    await fsDb.collection(MEMBERS_COLLECTION).doc(id).set({
      ...member, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // the members listener (firebase-auth.js) will add it to db.members
    // and re-render once Firestore confirms.
  } catch (err) {
    console.error("add member failed:", err);
    alert(state.lang === "bn" ? "সদস্য যোগ করা যায়নি — Firestore নিয়মাবলী (Rules) ঠিকভাবে সেট করা আছে কিনা দেখুন।" : "Couldn't add the member — check your Firestore Security Rules.");
  }
  db.ui.newMemberName = ""; db.ui.showAddMember = false; render();
}

async function deleteMember(id) {
  try {
    await fsDb.collection(MEMBERS_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error("delete member failed:", err);
    alert(state.lang === "bn" ? "সদস্য মোছা যায়নি — Firestore নিয়মাবলী (Rules) ঠিকভাবে সেট করা আছে কিনা দেখুন।" : "Couldn't delete the member — check your Firestore Security Rules.");
  }
}

function pageMembers(role) {
  const lang = state.lang;
  const editable = can(role, "members");
  const activeMembers = db.members.filter(m => m.status !== "pending");
  return `
    <div>
      ${pageHeader(T.m_members, editable ? T.membersSub : T.membersSubReadonly)}
      ${editable ? `<button class="btn-primary mb-4 flex items-center gap-2" onclick="toggleAddMember()">${icon("user-plus", 'style="width:16px;height:16px"')} ${L(T.m_members, lang)} ${L(T.add, lang)}</button>` : ""}
      ${(db.ui.showAddMember && editable) ? `
        <div class="card p-4 mb-4 flex gap-3">
          <input class="input-field" placeholder="${L(T.newMemberName, lang)}" value="${db.ui.newMemberName}" oninput="updateNewMemberName(this.value)" />
          <button class="btn-primary" onclick="addMember()">${L(T.add, lang)}</button>
        </div>` : ""}
      <div class="card overflow-hidden overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-canvas text-forest"><tr>
            <th class="text-left p-3">${L(T.colScoutId, lang)}</th><th class="text-left p-3">${L(T.colName, lang)}</th>
            <th class="text-left p-3">${L(T.colInstitution, lang)}</th><th class="text-left p-3">${L(T.colRank, lang)}</th><th class="text-left p-3">${L(T.colAction, lang)}</th>
          </tr></thead>
          <tbody>
            ${activeMembers.map(m => `
              <tr class="border-t border-rope border-opacity-20">
                <td class="p-3 text-rope">${m.id}</td>
                <td class="p-3 text-forest">${L(m.name, lang)}</td>
                <td class="p-3 text-rope">${L(m.inst, lang)}</td>
                <td class="p-3 text-rope">${L(m.rank, lang)}</td>
                <td class="p-3 flex gap-2">
                  <button ${editable ? "" : "disabled"} class="btn-outline text-xs flex items-center gap-1">${icon("edit-3", 'style="width:13px;height:13px"')} ${L(T.edit, lang)}</button>
                  <button ${editable ? "" : "disabled"} onclick="deleteMember('${m.id}')" class="btn-danger text-xs flex items-center gap-1">${icon("trash-2", 'style="width:13px;height:13px"')} ${L(T.delete, lang)}</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* Registrations = members whose public registration hasn't been
   approved yet (status: "pending", set by public/js/app.js's
   submitRegister()). Approving flips the status to "active" (so it
   shows up on the Members page + the public Rover Portal); rejecting
   deletes the member document entirely. */

async function approveApplication(id) {
  try {
    await fsDb.collection(MEMBERS_COLLECTION).doc(id).update({
      status: "active",
      rank: { bn: "রোভার স্কোয়ার", en: "Rover Squire" },
    });
  } catch (err) {
    console.error("approve failed:", err);
    alert(state.lang === "bn" ? "অনুমোদন করা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't approve — check your Firestore Security Rules.");
  }
}

async function rejectApplication(id) {
  try {
    await fsDb.collection(MEMBERS_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error("reject failed:", err);
    alert(state.lang === "bn" ? "বাতিল করা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't reject — check your Firestore Security Rules.");
  }
}

function pageRegistrations() {
  const lang = state.lang;
  const pending = db.members.filter(m => m.status === "pending");
  return `
    <div>
      ${pageHeader(T.m_registrations, T.regSub)}
      <div class="flex flex-col gap-3">
        ${pending.length === 0 ? `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>` : ""}
        ${pending.map(a => `
          <div class="card p-4 flex items-center justify-between">
            <div>
              <div class="text-forest font-medium">${L(a.name, lang)}</div>
              <div class="text-rope text-xs">${L(a.inst, lang)}${a.mobile ? " · " + a.mobile : ""}</div>
            </div>
            <div class="flex gap-2">
              <button class="btn-primary text-sm flex items-center gap-1" onclick="approveApplication('${a.id}')">${icon("check", 'style="width:14px;height:14px"')} ${L(T.approve, lang)}</button>
              <button class="btn-danger text-sm flex items-center gap-1" onclick="rejectApplication('${a.id}')">${icon("x", 'style="width:14px;height:14px"')} ${L(T.reject, lang)}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

function updateNewEventTitle(v) { db.ui.newEventTitle = v; }
function updateNewEventDate(v) { db.ui.newEventDate = v; }
function updateNewEventLocation(v) { db.ui.newEventLocation = v; }

async function addEvent() {
  const title = db.ui.newEventTitle.trim();
  if (!title) return;
  try {
    await fsDb.collection(EVENTS_COLLECTION).add({
      title, date: db.ui.newEventDate.trim(), location: db.ui.newEventLocation.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.ui.newEventTitle = ""; db.ui.newEventDate = ""; db.ui.newEventLocation = "";
  } catch (err) {
    console.error("add event failed:", err);
    alert(state.lang === "bn" ? "ইভেন্ট যোগ করা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't add the event — check your Firestore Security Rules.");
  }
  render();
}

async function deleteEvent(id) {
  try {
    await fsDb.collection(EVENTS_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error("delete event failed:", err);
    alert(state.lang === "bn" ? "ইভেন্ট মোছা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't delete the event — check your Firestore Security Rules.");
  }
}

function pageEvents(role) {
  const lang = state.lang;
  const canCreate = can(role, "events") || can(role, "events_create");
  return `
    <div>
      ${pageHeader(T.m_events)}
      ${canCreate ? `
        <div class="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <input class="input-field" placeholder="${L(T.newEventName, lang)}" value="${db.ui.newEventTitle}" oninput="updateNewEventTitle(this.value)" />
          <input class="input-field" placeholder="${lang === "bn" ? "তারিখ" : "Date"}" value="${db.ui.newEventDate}" oninput="updateNewEventDate(this.value)" />
          <input class="input-field" placeholder="${lang === "bn" ? "স্থান" : "Location"}" value="${db.ui.newEventLocation}" oninput="updateNewEventLocation(this.value)" />
          <button class="btn-primary shrink-0" onclick="addEvent()">${L(T.add, lang)}</button>
        </div>` : ""}
      <div class="grid md:grid-cols-2 gap-4">
        ${db.events.map(e => `
          <div class="card p-4 flex items-start justify-between gap-3">
            <div>
              <div class="text-forest font-medium">${e.title}</div>
              ${e.date || e.location ? `<div class="text-rope text-xs mt-1">${[e.date, e.location].filter(Boolean).join(" · ")}</div>` : ""}
            </div>
            ${canCreate ? `<button onclick="deleteEvent('${e.id}')" class="btn-danger text-xs flex items-center gap-1 shrink-0">${icon("trash-2", 'style="width:13px;height:13px"')} ${L(T.delete, lang)}</button>` : ""}
          </div>`).join("")}
      </div>
    </div>`;
}

function triggerGalleryUpload() {
  document.getElementById("galleryFileInput").click();
}

function handleGalleryFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = ""; // allow selecting the same file again later
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert(state.lang === "bn" ? "শুধু ছবি ফাইল আপলোড করা যাবে।" : "Only image files can be uploaded.");
    return;
  }
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      // Stored as a data: URL of the actual chosen photo. Note: Firestore
      // documents are capped at 1MB, so very large/high-res photos can
      // fail to upload — for a production site, switch this to Firebase
      // Storage and save the download URL here instead.
      await fsDb.collection(GALLERY_COLLECTION).add({
        src: reader.result,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error("gallery upload failed:", err);
      alert(state.lang === "bn" ? "ছবি আপলোড করা যায়নি — ছবিটি অনেক বড় অথবা Firestore নিয়মাবলী (Rules) ঠিক নেই।" : "Couldn't upload the photo — it may be too large, or your Firestore Security Rules aren't set up yet.");
    }
    render();
  };
  reader.onerror = () => {
    alert(state.lang === "bn" ? "ছবি পড়তে সমস্যা হয়েছে, আবার চেষ্টা করো।" : "Couldn't read that image, please try again.");
  };
  reader.readAsDataURL(file);
}

async function deleteGalleryItem(id) {
  try {
    await fsDb.collection(GALLERY_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error("delete gallery item failed:", err);
    alert(state.lang === "bn" ? "ছবি মোছা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't delete the photo — check your Firestore Security Rules.");
  }
}

function galleryImgSrc(item) {
  // New uploads are real data: URLs; the original demo entries are
  // just picsum.photos seed names, kept working for backward-compat.
  return item.startsWith("data:") || item.startsWith("http") ? item : `https://picsum.photos/seed/${item}/300/220`;
}

function pageGallery() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_gallery)}
      <div class="card p-4 mb-4 flex items-center gap-3">
        ${icon("upload-cloud", 'style="width:20px;height:20px" class="text-ember"')}
        <button class="btn-primary text-sm" onclick="triggerGalleryUpload()">${L(T.uploadNewPhoto, lang)}</button>
        <input type="file" id="galleryFileInput" accept="image/*" style="display:none" onchange="handleGalleryFileSelected(event)" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${db.gallery.map((item) => `
          <div class="relative">
            <img src="${galleryImgSrc(item.src)}" class="rounded-lg w-full h-28 object-cover" alt="gallery" />
            <button onclick="deleteGalleryItem('${item.id}')" class="absolute top-1 right-1 bg-forest text-cream rounded-full p-1">${icon("trash-2", 'style="width:12px;height:12px"')}</button>
          </div>`).join("")}
      </div>
    </div>`;
}

function updateNoticeTitle(v) { db.ui.noticeTitle = v; }

async function publishNotice() {
  const lang = state.lang;
  const title = db.ui.noticeTitle.trim();
  if (!title) return;
  try {
    await fsDb.collection(NOTICES_COLLECTION).add({
      title, tag: L(T.m_notices, lang), date: L(T.today, lang),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.ui.noticeTitle = "";
  } catch (err) {
    console.error("publish notice failed:", err);
    alert(state.lang === "bn" ? "প্রকাশ করা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't publish — check your Firestore Security Rules.");
  }
  render();
}

async function deleteNotice(id) {
  try {
    await fsDb.collection(NOTICES_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error("delete notice failed:", err);
    alert(state.lang === "bn" ? "নোটিশ মোছা যায়নি — Firestore নিয়মাবলী (Rules) দেখুন।" : "Couldn't delete the notice — check your Firestore Security Rules.");
  }
}

function pageNotices() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_notices)}
      <div class="card p-4 mb-4 flex gap-3">
        <input class="input-field" placeholder="${L(T.noticeTitleLabel, lang)}" value="${db.ui.noticeTitle}" oninput="updateNoticeTitle(this.value)" />
        <button class="btn-primary flex items-center gap-1" onclick="publishNotice()">${L(T.publish, lang)}</button>
      </div>
      <div class="flex flex-col gap-2">
        ${db.notices.map(n => `
          <div class="card p-3 flex justify-between items-center">
            <div class="text-forest">${n.title}</div>
            <div class="flex items-center gap-3">
              <span class="text-rope text-xs">${n.date}</span>
              ${n.id ? `<button onclick="deleteNotice('${n.id}')" class="btn-danger text-xs flex items-center gap-1">${icon("trash-2", 'style="width:13px;height:13px"')}${L(T.delete, lang)}</button>` : ""}
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

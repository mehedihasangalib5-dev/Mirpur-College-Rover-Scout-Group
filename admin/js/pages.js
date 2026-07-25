/* ---------------------------------------------------------
   PAGES.JS — the 16 admin pages, each ported 1:1 from the
   corresponding React component in frontend/Admin/*.jsx
--------------------------------------------------------- */

function pageDashboard() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_dashboard, T.dashSub)}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${statCard("users", L(T.statMembers, lang), bnNum(db.members.length, lang))}
        ${statCard("calendar", L(T.statEvents, lang), bnNum(db.events.length, lang))}
        ${statCard("bell", L(T.statNotices, lang), bnNum(db.notices.length, lang))}
        ${statCard("user-plus", L(T.statPending, lang), bnNum(db.applications.length, lang))}
      </div>
    </div>`;
}

/* groups live members by join-month (needs a real Firestore createdAt
   timestamp, so this only fills in once Firebase is connected) */
function memberGrowthByMonth(members, lang) {
  const map = new Map();
  members.forEach((m) => {
    if (!(m.createdAt && m.createdAt.toDate)) return;
    const d = m.createdAt.toDate();
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { month: "short" });
    if (!map.has(key)) map.set(key, { month: label, count: 0, sortDate: d });
    map.get(key).count++;
  });
  return [...map.values()].sort((a, b) => a.sortDate - b.sortDate);
}

/* rank/role breakdown (রোভার মেট / রোভার স্কাউট / রোভার স্কোয়ার) — makes
   sense here since every member belongs to the same single institution */
function rankDistribution(members, lang) {
  const counts = {};
  members.forEach((m) => {
    const label = L(m.rank, lang) || (lang === "bn" ? "অনুল্লেখিত" : "Unspecified");
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function pageAnalytics() {
  const lang = state.lang;
  const genderData = SEED_GENDER.map(g => ({ name: L(T[g.key], lang), count: g.count }));
  const growthData = memberGrowthByMonth(db.members, lang);
  const rankData = rankDistribution(db.members, lang);
  const recentRegs = [
    ...db.applications.map(a => ({ name: L(a.name, lang), scoutId: a.id, status: "pending", date: applicationDate(a, lang) })),
    ...db.members.slice(0, 10).map(m => ({ name: L(m.name, lang), scoutId: m.id, status: "active", date: "" })),
  ];
  return `
    <div>
      ${pageHeader(T.m_analytics, T.analyticsSub)}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        ${statCard("users", L(T.statMembers, lang), bnNum(db.members.length, lang))}
        ${statCard("calendar", L(T.statUpcoming, lang), bnNum(db.events.length, lang))}
        ${statCard("bell", L(T.statNotices, lang), bnNum(db.notices.length, lang))}
        ${statCard("user-plus", L(T.statPending, lang), bnNum(db.applications.length, lang))}
      </div>

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("bar-chart-3", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartMembersGrowth, lang)}</div>
          ${growthData.length ? miniBarChart(growthData, "month", "count") : `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>`}
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("compass", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartRankDistribution, lang)}</div>
          ${rankData.length ? hBarList(rankData, "name", "count") : `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>`}
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("users", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.chartGender, lang)}</div>
          ${genderData.length ? hBarList(genderData, "name", "count") : `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>`}
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("school", 'style="width:16px;height:16px" class="text-ember"')} ${L(T.institutionNote, lang)}</div>
          <div class="flex items-center gap-3 h-full text-rope text-sm">${icon("map-pin", 'style="width:16px;height:16px" class="text-ember flex-shrink-0"')} ${L(T.institutionNoteBody, lang)}</div>
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
            ${recentRegs.length === 0 ? `<tr><td colspan="4" class="p-3 text-rope text-sm">${L(T.regEmpty, lang)}</td></tr>` : ""}
            ${recentRegs.map(r => `
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
function addMember() {
  const name = db.ui.newMemberName.trim();
  if (!name) return;
  if (fbContentReady()) {
    fbAddMember(name).catch(contentErr); // listener updates db.members + re-renders on success
  } else {
    db.members.push({ id: `MCRSG-${1190 + db.members.length}`, name, inst: "মিরপুর কলেজ", rank: "রোভার স্কোয়ার" });
  }
  db.ui.newMemberName = ""; db.ui.showAddMember = false; render();
}
function deleteMember(id) {
  if (fbContentReady()) { fbDeleteMember(id).catch(contentErr); }
  else { db.members = db.members.filter(x => x.id !== id); }
  render();
}

function pageMembers(role) {
  const lang = state.lang;
  const editable = can(role, "members");
  return `
    <div>
      ${pageHeader(T.m_members, editable ? T.membersSub : T.membersSubReadonly)}
      ${editable ? `<button class="btn-primary mb-4 flex items-center gap-2" onclick="toggleAddMember()">${icon("user-plus", 'style="width:16px;height:16px"')} ${L(T.m_members, lang)} ${L(T.add, lang)}</button>` : ""}
      ${(db.ui.showAddMember && editable) ? `
        <div class="card p-4 mb-4 flex gap-3">
          <input class="input-field" placeholder="${L(T.newMemberName, lang)}" oninput="updateNewMemberName(this.value)" />
          <button class="btn-primary" onclick="addMember()">${L(T.add, lang)}</button>
        </div>` : ""}
      <div class="card overflow-hidden overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-canvas text-forest"><tr>
            <th class="text-left p-3">${L(T.colScoutId, lang)}</th><th class="text-left p-3">${L(T.colName, lang)}</th>
            <th class="text-left p-3">${L(T.colInstitution, lang)}</th><th class="text-left p-3">${L(T.colRank, lang)}</th><th class="text-left p-3">${L(T.colAction, lang)}</th>
          </tr></thead>
          <tbody>
            ${db.members.map(m => `
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

function approveApplication(id) {
  const app = db.applications.find(x => x.id == id);
  if (!app) return;
  if (fbContentReady()) { fbApproveApplication(app).catch(contentErr); }
  else { db.applications = db.applications.filter(x => x.id != id); }
  render();
}
function rejectApplication(id) {
  if (fbContentReady()) { fbRejectApplication(id).catch(contentErr); }
  else { db.applications = db.applications.filter(x => x.id != id); }
  render();
}
function applicationDate(a, lang) {
  if (a.createdAt && a.createdAt.toDate) return a.createdAt.toDate().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB");
  return L(a.joiningDate, lang) || a.date || "";
}

function pageRegistrations() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_registrations, T.regSub)}
      <div class="flex flex-col gap-3">
        ${db.applications.length === 0 ? `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>` : ""}
        ${db.applications.map(a => `
          <div class="card p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="${a.photo || `https://picsum.photos/seed/${encodeURIComponent(a.id)}/80/80`}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="applicant" />
              <div>
                <div class="text-forest font-medium">${L(a.name, lang)}</div>
                <div class="text-rope text-xs">${L(a.inst, lang)} · ${L(T.appliedOn, lang)}: ${applicationDate(a, lang)}</div>
              </div>
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
function addEvent() {
  const title = db.ui.newEventTitle.trim();
  if (!title) return;
  if (fbContentReady()) { fbAddEvent(title).catch(contentErr); }
  else { db.events.push({ id: `local-${Date.now()}`, title }); }
  db.ui.newEventTitle = "";
  render();
}
function deleteEvent(id) {
  if (fbContentReady()) { fbDeleteEvent(id).catch(contentErr); }
  else { db.events = db.events.filter(e => e.id !== id); }
  render();
}

function pageEvents(role) {
  const lang = state.lang;
  const canCreate = can(role, "events") || can(role, "events_create");
  return `
    <div>
      ${pageHeader(T.m_events)}
      ${canCreate ? `
        <div class="card p-4 mb-4 flex gap-3">
          <input class="input-field" placeholder="${L(T.newEventName, lang)}" value="${db.ui.newEventTitle}" oninput="updateNewEventTitle(this.value)" />
          <button class="btn-primary" onclick="addEvent()">${L(T.add, lang)}</button>
        </div>` : ""}
      <div class="grid md:grid-cols-2 gap-4">
        ${db.events.map(e => `
          <div class="card p-4 flex items-center justify-between gap-3">
            <span class="text-forest">${L(e.title, lang)}</span>
            ${canCreate ? `<button onclick="deleteEvent('${e.id}')" class="btn-danger text-xs flex items-center gap-1 flex-shrink-0">${icon("trash-2", 'style="width:13px;height:13px"')} ${L(T.delete, lang)}</button>` : ""}
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
  reader.onload = () => {
    const dataUrl = reader.result; // a data: URL of the actual chosen photo
    if (fbContentReady()) {
      // Firestore documents are capped at ~1MiB — warn before a large
      // photo fails to save instead of silently doing nothing.
      if (dataUrl.length > 900000) {
        alert(state.lang === "bn"
          ? "ছবিটি অনেক বড় (Firestore-এর ১MB সীমার কাছাকাছি)। আরেকটু ছোট/কম রেজ্যুলেশনের ছবি দিয়ে আবার চেষ্টা করুন।"
          : "This image is too large for Firestore's ~1MB document limit. Please try a smaller/lower-resolution photo.");
        return;
      }
      fbAddGalleryImage(dataUrl).catch(contentErr);
    } else {
      db.gallery.push({ id: `local-${Date.now()}`, src: dataUrl });
      render();
    }
  };
  reader.onerror = () => {
    alert(state.lang === "bn" ? "ছবি পড়তে সমস্যা হয়েছে, আবার চেষ্টা করো।" : "Couldn't read that image, please try again.");
  };
  reader.readAsDataURL(file);
}

function deleteGalleryItem(id) {
  if (fbContentReady()) { fbDeleteGalleryImage(id).catch(contentErr); }
  else { db.gallery = db.gallery.filter(g => g.id !== id); render(); }
}

function galleryImgSrc(item) {
  // New uploads are real data: URLs; the original 3 demo entries are
  // just picsum.photos seed names, kept working for backward-compat.
  const src = item.src || item;
  return src.startsWith("data:") || src.startsWith("http") ? src : `https://picsum.photos/seed/${src}/300/220`;
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
            <img src="${galleryImgSrc(item)}" class="rounded-lg w-full h-28 object-cover" alt="gallery" />
            <button onclick="deleteGalleryItem('${item.id}')" class="absolute top-1 right-1 bg-forest text-cream rounded-full p-1">${icon("trash-2", 'style="width:12px;height:12px"')}</button>
          </div>`).join("")}
      </div>
    </div>`;
}

function updateNoticeTitle(v) { db.ui.noticeTitle = v; }
function publishNotice() {
  const lang = state.lang;
  const title = db.ui.noticeTitle.trim();
  if (!title) return;
  const dateLabel = L(T.today, lang);
  if (fbContentReady()) { fbPublishNotice(title, dateLabel).catch(contentErr); }
  else { db.notices.unshift({ id: Date.now(), title, date: dateLabel }); }
  db.ui.noticeTitle = "";
  render();
}
function deleteNotice(id) {
  if (fbContentReady()) { fbDeleteNotice(id).catch(contentErr); }
  else { db.notices = db.notices.filter(n => n.id !== id); }
  render();
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
            <div class="text-forest">${L(n.title, lang)}</div>
            <div class="flex items-center gap-3">
              <span class="text-rope text-xs">${n.date}</span>
              <button onclick="deleteNotice('${n.id}')" class="btn-danger text-xs flex items-center gap-1">${icon("trash-2", 'style="width:13px;height:13px"')}${L(T.delete, lang)}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

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
function addMember() {
  if (!db.ui.newMemberName.trim()) return;
  db.members.push({ id: `MCRSG-${1190 + db.members.length}`, name: db.ui.newMemberName, inst: "মিরপুর কলেজ", rank: "রোভার স্কোয়ার" });
  db.ui.newMemberName = ""; db.ui.showAddMember = false; render();
}
function deleteMember(id) { db.members = db.members.filter(x => x.id !== id); render(); }

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
                <td class="p-3 text-forest">${m.name}</td>
                <td class="p-3 text-rope">${m.inst}</td>
                <td class="p-3 text-rope">${m.rank}</td>
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

function approveApplication(id) { db.applications = db.applications.filter(x => x.id !== id); render(); }
function rejectApplication(id) { db.applications = db.applications.filter(x => x.id !== id); render(); }

function pageRegistrations() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_registrations, T.regSub)}
      <div class="flex flex-col gap-3">
        ${db.applications.length === 0 ? `<div class="text-rope text-sm">${L(T.regEmpty, lang)}</div>` : ""}
        ${db.applications.map(a => `
          <div class="card p-4 flex items-center justify-between">
            <div>
              <div class="text-forest font-medium">${a.name}</div>
              <div class="text-rope text-xs">${a.inst} · ${L(T.appliedOn, lang)}: ${a.date}</div>
            </div>
            <div class="flex gap-2">
              <button class="btn-primary text-sm flex items-center gap-1" onclick="approveApplication(${a.id})">${icon("check", 'style="width:14px;height:14px"')} ${L(T.approve, lang)}</button>
              <button class="btn-danger text-sm flex items-center gap-1" onclick="rejectApplication(${a.id})">${icon("x", 'style="width:14px;height:14px"')} ${L(T.reject, lang)}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

function updateNewEventTitle(v) { db.ui.newEventTitle = v; }
function addEvent() { if (db.ui.newEventTitle.trim()) { db.events.push(db.ui.newEventTitle); db.ui.newEventTitle = ""; render(); } }

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
        ${db.events.map(e => `<div class="card p-4 text-forest">${e}</div>`).join("")}
      </div>
    </div>`;
}

function uploadNewPhoto() { db.gallery.push(`new${db.gallery.length}`); render(); }
function deleteGalleryItem(seed) { db.gallery = db.gallery.filter(x => x !== seed); render(); }

function pageGallery() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_gallery)}
      <div class="card p-4 mb-4 flex items-center gap-3">
        ${icon("upload-cloud", 'style="width:20px;height:20px" class="text-ember"')}
        <button class="btn-primary text-sm" onclick="uploadNewPhoto()">${L(T.uploadNewPhoto, lang)}</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${db.gallery.map(seed => `
          <div class="relative">
            <img src="https://picsum.photos/seed/${seed}/300/220" class="rounded-lg w-full h-28 object-cover" alt="gallery" />
            <button onclick="deleteGalleryItem('${seed}')" class="absolute top-1 right-1 bg-forest text-cream rounded-full p-1">${icon("trash-2", 'style="width:12px;height:12px"')}</button>
          </div>`).join("")}
      </div>
    </div>`;
}

function updateNoticeTitle(v) { db.ui.noticeTitle = v; }
function publishNotice() {
  const lang = state.lang;
  if (db.ui.noticeTitle.trim()) {
    db.notices.unshift({ id: Date.now(), title: db.ui.noticeTitle, date: L(T.today, lang) });
    db.ui.noticeTitle = ""; render();
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
              <button class="btn-outline text-xs flex items-center gap-1">${icon("edit-3", 'style="width:13px;height:13px"')}${L(T.edit, lang)}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

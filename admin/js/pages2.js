/* ---------------------------------------------------------
   PAGES2.JS — remaining admin pages (email, push, export,
   audit log, users, permissions, roles, settings) —
   continues js/pages.js
--------------------------------------------------------- */

function sendEmail() { db.ui.emailSent = true; render(); }

function pageEmail() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_email)}
      <div class="card p-5 max-w-lg flex flex-col gap-3">
        <input class="input-field" placeholder="${L(T.emailRecipientPh, lang)}" />
        <input class="input-field" placeholder="${L(T.emailSubjectPh, lang)}" />
        <textarea class="input-field" rows="4" placeholder="${L(T.emailMessagePh, lang)}"></textarea>
        <button class="btn-primary flex items-center gap-2 w-fit" onclick="sendEmail()">${icon("send", 'style="width:16px;height:16px"')} ${L(T.send, lang)}</button>
        ${db.ui.emailSent ? `<div class="text-ok text-sm flex items-center gap-2">${icon("check", 'style="width:14px;height:14px"')} ${L(T.emailSentMsg, lang)}</div>` : ""}
      </div>
    </div>`;
}

function togglePushSubscribed() { db.pushSubscribed = !db.pushSubscribed; render(); }
function setPushRecipient(v) { db.ui.pushRecipient = v; }
function setPushTitle(v) { db.ui.pushTitle = v; }
function setPushMessage(v) { db.ui.pushMessage = v; }
function markNotificationRead(id) { db.notifications = db.notifications.map(x => x.id === id ? { ...x, read: true } : x); render(); }

function sendPush() {
  const lang = state.lang;
  if (!db.ui.pushTitle.trim()) return;
  const deviceCount = db.ui.pushRecipient === "all" ? db.members.length + 6 : 1;
  db.ui.pushSentInfo = deviceCount;
  db.notifications.unshift({ id: Date.now(), title: db.ui.pushTitle, body: db.ui.pushMessage, read: false, time: L(T.today, lang) });
  db.ui.pushTitle = ""; db.ui.pushMessage = "";
  render();
  setTimeout(() => { db.ui.pushSentInfo = null; render(); }, 2500);
}

function pagePushSettings() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_pushsettings, T.pushSub)}

      <div class="card p-5 max-w-lg mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-forest rounded-lg p-2.5">${icon("bell-ring", 'style="width:18px;height:18px" class="text-cream"')}</div>
          <div>
            <div class="text-forest font-medium">${L(T.pushThisDevice, lang)}</div>
            <div class="text-xs ${db.pushSubscribed ? "text-ok" : "text-rope"}">${db.pushSubscribed ? L(T.pushSubscribed, lang) : L(T.pushUnsubscribed, lang)}</div>
          </div>
        </div>
        <button onclick="togglePushSubscribed()" class="${db.pushSubscribed ? "btn-danger" : "btn-primary"} text-sm">${db.pushSubscribed ? L(T.pushUnsubscribeBtn, lang) : L(T.pushSubscribeBtn, lang)}</button>
      </div>

      <div class="card p-5 max-w-lg mb-6">
        <div class="ap-eyebrow text-xs text-rope mb-3">${L(T.pushCompose, lang)}</div>
        <div class="flex flex-col gap-3">
          <div>
            <label class="text-sm text-rope block mb-1">${L(T.pushRecipient, lang)}</label>
            <select class="input-field" onchange="setPushRecipient(this.value)">
              <option value="all" ${db.ui.pushRecipient === "all" ? "selected" : ""}>${L(T.pushRecipientAll, lang)}</option>
              ${db.members.map(m => `<option value="${m.id}" ${db.ui.pushRecipient === m.id ? "selected" : ""}>${L(m.name, lang)}</option>`).join("")}
            </select>
          </div>
          <input class="input-field" placeholder="${L(T.pushTitleLabel, lang)}" value="${db.ui.pushTitle}" oninput="setPushTitle(this.value)" />
          <textarea class="input-field" rows="3" placeholder="${L(T.pushMessageLabel, lang)}" oninput="setPushMessage(this.value)">${db.ui.pushMessage}</textarea>
          <button class="btn-primary flex items-center gap-2 w-fit" ${db.ui.pushTitle.trim() ? "" : "disabled"} onclick="sendPush()">${icon("send", 'style="width:16px;height:16px"')} ${L(T.send, lang)}</button>
          ${db.ui.pushSentInfo ? `<div class="text-ok text-sm flex items-center gap-2">${icon("check-circle-2", 'style="width:14px;height:14px"')} ${L(T.pushSent, lang)} ${db.ui.pushSentInfo} ${L(T.pushDevices, lang)}</div>` : ""}
        </div>
      </div>

      ${pageHeader(T.pushRecent)}
      <div class="flex flex-col gap-2 max-w-lg">
        ${db.notifications.map(n => `
          <div class="card p-4 flex items-start justify-between gap-3">
            <div>
              <div class="text-forest font-medium text-sm">${n.title}</div>
              ${n.body ? `<div class="text-rope text-xs mt-0.5">${n.body}</div>` : ""}
              <div class="text-rope text-xs mt-1 opacity-70">${n.time}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span class="${n.read ? "tag-info" : "tag-ok"}">${n.read ? L(T.read, lang) : L(T.unread, lang)}</span>
              ${!n.read ? `<button class="text-xs text-ember" style="background:none;border:none;text-decoration:underline;cursor:pointer" onclick="markNotificationRead(${n.id})">${L(T.markRead, lang)}</button>` : ""}
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

function pageExportTools() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_exporttools)}
      <div class="grid sm:grid-cols-2 gap-4 max-w-lg">
        <button class="card p-5 flex items-center gap-3 text-forest" style="border:1px solid var(--surface-border);cursor:pointer">${icon("file-spreadsheet", 'class="text-ember"')} ${L(T.exportExcel, lang)}</button>
        <button class="card p-5 flex items-center gap-3 text-forest" style="border:1px solid var(--surface-border);cursor:pointer">${icon("database", 'class="text-ember"')} ${L(T.exportBackup, lang)}</button>
      </div>
    </div>`;
}

function setAuditFilter(v) { db.auditFilter = v; db.auditPage = 0; render(); }
function toggleAuditDetails(id) { db.ui.auditOpenDetails = db.ui.auditOpenDetails === id ? null : id; render(); }
function auditPrevPage() { db.auditPage = Math.max(0, db.auditPage - 1); render(); }
function auditNextPage(totalFiltered, pageSize) { if ((db.auditPage + 1) * pageSize < totalFiltered) { db.auditPage++; render(); } }

function pageAuditLog() {
  const lang = state.lang;
  const pageSize = 4;
  const actions = Array.from(new Set(SEED_AUDIT_LOG.map(l => l.action)));
  const filtered = db.auditFilter ? SEED_AUDIT_LOG.filter(l => l.action === db.auditFilter) : SEED_AUDIT_LOG;
  const pageRows = filtered.slice(db.auditPage * pageSize, db.auditPage * pageSize + pageSize);
  return `
    <div>
      ${pageHeader(T.m_auditlog, T.auditSub)}
      <div class="flex items-center gap-3 mb-4">
        ${icon("shield-alert", 'style="width:16px;height:16px" class="text-ember"')}
        <select class="input-field max-w-xs" onchange="setAuditFilter(this.value)">
          <option value="" ${db.auditFilter === "" ? "selected" : ""}>${L(T.all, lang)} — ${L(T.filterByAction, lang)}</option>
          ${actions.map(a => `<option value="${a}" ${db.auditFilter === a ? "selected" : ""}>${a}</option>`).join("")}
        </select>
      </div>

      ${pageRows.length === 0 ? `<div class="text-rope text-sm">${L(T.auditEmpty, lang)}</div>` : `
        <div class="card overflow-hidden overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-canvas text-forest"><tr>
              <th class="text-left p-3">${L(T.colTime, lang)}</th>
              <th class="text-left p-3">${L(T.colUser, lang)}</th>
              <th class="text-left p-3">${L(T.colActionCol, lang)}</th>
              <th class="text-left p-3">${L(T.colTarget, lang)}</th>
              <th class="text-left p-3">${L(T.colIp, lang)}</th>
              <th class="text-left p-3">${L(T.colDetails, lang)}</th>
            </tr></thead>
            <tbody>
              ${pageRows.map(l => `
                <tr class="border-t border-rope border-opacity-20 align-top">
                  <td class="p-3 text-rope whitespace-nowrap">${l.time}</td>
                  <td class="p-3 text-forest">${l.user}</td>
                  <td class="p-3"><span class="tag-${ACTION_TAG[l.action] || "info"}">${l.action}</span></td>
                  <td class="p-3 text-rope">${l.target}</td>
                  <td class="p-3 text-rope">${l.ip}</td>
                  <td class="p-3">
                    <button class="text-ember text-xs flex items-center gap-1" style="background:none;border:none;text-decoration:underline;cursor:pointer" onclick="toggleAuditDetails(${l.id})">${icon("eye", 'style="width:12px;height:12px"')} ${L(T.view, lang)}</button>
                    ${db.ui.auditOpenDetails === l.id ? `<pre class="text-xs bg-canvas rounded p-2 mt-1 max-w-xs overflow-x-auto">${l.details}</pre>` : ""}
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`}

      <div class="flex items-center gap-2 mt-4">
        <button class="btn-outline text-xs" ${db.auditPage === 0 ? "disabled" : ""} onclick="auditPrevPage()">${L(T.prev, lang)}</button>
        <button class="btn-outline text-xs" ${(db.auditPage + 1) * pageSize >= filtered.length ? "disabled" : ""} onclick="auditNextPage(${filtered.length}, ${pageSize})">${L(T.next, lang)}</button>
      </div>
    </div>`;
}

function invitedTable(list, revokeFn) {
  const lang = state.lang;
  if (!list.length) return "";
  return `
    <div class="card overflow-hidden overflow-x-auto mt-4">
      <table class="w-full text-sm">
        <thead class="bg-canvas text-forest"><tr>
          <th class="text-left p-3">${L(T.colEmail, lang)}</th>
          <th class="text-left p-3">${L(T.colAddedBy, lang)}</th>
          <th class="text-left p-3">${L(T.colAction, lang)}</th>
        </tr></thead>
        <tbody>
          ${list.map(u => `
            <tr class="border-t border-rope border-opacity-20">
              <td class="p-3 text-forest">${u.email} <span class="tag-ok text-[10px] ml-1">${L(T.unlocked, lang)}</span></td>
              <td class="p-3 text-rope">${u.addedBy}</td>
              <td class="p-3"><button class="btn-outline text-xs flex items-center gap-1" onclick="${revokeFn}('${u.email}')">${icon("lock", 'style="width:12px;height:12px"')}${L(T.revoke, lang)}</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function inviteSuperAdminBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("shield-check", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteSuperAdminTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteSuperAdminSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteSuperAdminInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteSuperAdminInput}" oninput="db.inviteSuperAdminInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedSuperAdmin()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteSuperAdminError ? `<div class="text-danger text-xs mt-2">${db.inviteSuperAdminError}</div>` : ""}
      ${db.invitedSuperAdmins.length ? invitedTable(db.invitedSuperAdmins, "revokeInvitedSuperAdmin") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedSuperAdmins, lang)}</p>`}
    </div>`;
}

function inviteAdminBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("user-plus", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteAdminTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteAdminSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteAdminInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteAdminInput}" oninput="db.inviteAdminInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedAdmin()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteAdminError ? `<div class="text-danger text-xs mt-2">${db.inviteAdminError}</div>` : ""}
      ${db.invitedAdmins.length ? invitedTable(db.invitedAdmins, "revokeInvitedAdmin") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedAdmins, lang)}</p>`}
    </div>`;
}

function inviteEditorBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("user-plus", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteEditorTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteEditorSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteEditorInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteEditorInput}" oninput="db.inviteEditorInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedEditor()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteEditorError ? `<div class="text-danger text-xs mt-2">${db.inviteEditorError}</div>` : ""}
      ${db.invitedEditors.length ? invitedTable(db.invitedEditors, "revokeInvitedEditor") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedEditors, lang)}</p>`}
    </div>`;
}

function pageUsers(role) {
  return `
    <div>
      ${pageHeader(T.m_users, T.usersSub)}
      <div class="flex flex-col gap-5 max-w-2xl">
        ${role === "superadmin" ? inviteSuperAdminBlock() : ""}
        ${role === "superadmin" ? inviteAdminBlock() : ""}
        ${role === "superadmin" || role === "leader" ? inviteEditorBlock() : ""}
      </div>
    </div>`;
}

function pagePermissions() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_permissions, T.permsSub)}
      <div class="card overflow-hidden max-w-lg">
        <table class="w-full text-sm">
          <thead class="bg-canvas text-forest"><tr><th class="text-left p-3">${L(T.colFeature, lang)}</th><th class="text-left p-3">${L(T.colPermission, lang)}</th></tr></thead>
          <tbody>
            ${EDITOR_PERMISSION_TABLE.map(([f, ok]) => `
              <tr class="border-t border-rope border-opacity-20">
                <td class="p-3 text-forest">${f}</td>
                <td class="p-3">${ok ? `<span class="tag-ok">${L(T.allowed, lang)}</span>` : `<span class="tag-no">${L(T.denied, lang)}</span>`}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function pageRoles() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_roles)}
      <div class="grid sm:grid-cols-3 gap-4">
        ${Object.entries(ROLE_LABEL_KEY).map(([key, labelKey]) => `
          <div class="card p-5">
            ${icon("shield-check", 'class="text-ember mb-2"')}
            <div class="text-forest font-semibold">${L(T[labelKey], lang)}</div>
            <div class="text-rope text-xs mt-1">${[...PERMISSIONS[key]].length} ${L(T.featuresAccess, lang)}</div>
          </div>`).join("")}
      </div>
    </div>`;
}

function pageSettings() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_settings)}
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("palette", 'style="width:18px;height:18px" class="text-ember"')} ${L(T.themeControl, lang)}</div>
          <div class="flex gap-3">
            ${["#006B3F","#D4AF37","#FFFFFF","#1F2937"].map(c => `<div class="w-8 h-8 rounded-full border-2 border-white shadow" style="background:${c}"></div>`).join("")}
          </div>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("image-plus", 'style="width:18px;height:18px" class="text-ember"')} ${L(T.logoChange, lang)}</div>
          <input type="file" class="input-field mb-2" />
          <button class="btn-primary text-sm">${L(T.upload, lang)}</button>
        </div>
        <div class="card p-5 md:col-span-2">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("settings", 'style="width:18px;height:18px" class="text-ember"')} ${L(T.generalInfo, lang)}</div>
          <div class="grid sm:grid-cols-2 gap-3">
            <input class="input-field" placeholder="${L(T.siteNamePh, lang)}" value="মিরপুর কলেজ রোভার স্কাউট গ্রুপ" />
            <input class="input-field" placeholder="${L(T.contactEmailPh, lang)}" value="info@nationalscout.org.bd" />
          </div>
        </div>
      </div>
    </div>`;
}

const PAGE_RENDERERS = {
  dashboard: pageDashboard, analytics: pageAnalytics, members: pageMembers, registrations: pageRegistrations,
  events: pageEvents, gallery: pageGallery, notices: pageNotices,
  email: pageEmail, pushsettings: pagePushSettings, exporttools: pageExportTools,
  auditlog: pageAuditLog, users: pageUsers, permissions: pagePermissions, roles: pageRoles, settings: pageSettings,
};

render();
